from confluent_kafka.admin import AdminClient, NewTopic
from .topic_config import KAFKA_BOOTSTRAP_SERVERS, LOG_EVENTS_TOPIC, NUM_PARTITIONS, REPLICATION_FACTOR

def create_topics():
    admin_client = AdminClient({"bootstrap.servers": KAFKA_BOOTSTRAP_SERVERS})
    topic = NewTopic(LOG_EVENTS_TOPIC, num_partitions=NUM_PARTITIONS, replication_factor=REPLICATION_FACTOR)
    futures = admin_client.create_topics([topic])

    for topic_name, future in futures.items():
        try:
            future.result()
            print(f"Created Kafka topic: {topic_name}")
        except Exception as error:
            if "Topic already exists" in str(error):
                print(f"Kafka topic already exists: {topic_name}")
            else:
                raise

if __name__ == "__main__":
    create_topics()
