"""
Thin wrapper around confluent-kafka's Producer so every service publishes
events the same way: JSON-serialized Pydantic models, keyed for partition
locality where an entity ID is available.
"""
from __future__ import annotations

import json
import logging
import os
from typing import Optional

from confluent_kafka import Producer

from . import BaseEvent, Topics  # noqa: F401  (re-export for convenience)

logger = logging.getLogger(__name__)


class EventPublisher:
    """
    Usage:
        publisher = EventPublisher()
        publisher.publish(Topics.LOG_RAW, event, key=event.source_asset_id)
        publisher.flush()  # call on shutdown / before process exit
    """

    def __init__(self, bootstrap_servers: Optional[str] = None):
        servers = bootstrap_servers or os.environ.get("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
        self._producer = Producer({"bootstrap.servers": servers})

    def publish(self, topic: Topics, event: BaseEvent, key: Optional[str] = None) -> None:
        payload = event.model_dump_json().encode("utf-8")
        self._producer.produce(
            topic=topic.value,
            key=key.encode("utf-8") if key else None,
            value=payload,
            callback=self._delivery_report,
        )
        # Non-blocking; triggers any pending delivery callbacks.
        self._producer.poll(0)

    @staticmethod
    def _delivery_report(err, msg) -> None:
        if err is not None:
            logger.error("Event delivery failed for topic=%s: %s", msg.topic() if msg else "?", err)
        else:
            logger.debug("Event delivered to %s [partition %s]", msg.topic(), msg.partition())

    def flush(self, timeout: float = 5.0) -> int:
        """Blocks until all outstanding messages are delivered or timeout elapses.
        Returns the number of messages still undelivered (0 = fully flushed)."""
        return self._producer.flush(timeout)


def parse_event(raw_value: bytes) -> dict:
    """Consumer-side helper: decode a raw Kafka message value back to a dict.
    Each consumer then validates into its expected event type, e.g.
    LogRawEvent.model_validate(parse_event(msg.value()))."""
    return json.loads(raw_value.decode("utf-8"))
