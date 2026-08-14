"""
Central lookup from `source_type` string to its normalizer instance.
This is the ONE file that needs a new line when the team adds the
remaining six sources (windows, docker, kubernetes, cloud, firewall,
database) in Sprint 2 (roadmap Chapter 13, Member 3).
"""
from app.collectors.base import BaseNormalizer
from app.collectors.linux import LinuxLogNormalizer
from app.collectors.application import ApplicationLogNormalizer

# TODO(Sprint 2, Member 3): add WindowsLogNormalizer, DockerLogNormalizer,
# KubernetesLogNormalizer, CloudLogNormalizer, FirewallLogNormalizer,
# DatabaseLogNormalizer — see roadmap Chapter 7.2 for the collection
# mechanism each one should assume upstream (Winlogbeat, Fluent Bit, etc).
_REGISTRY: dict[str, BaseNormalizer] = {
    "linux": LinuxLogNormalizer(),
    "application": ApplicationLogNormalizer(),
}

SUPPORTED_SOURCE_TYPES = tuple(_REGISTRY.keys())


def get_normalizer(source_type: str) -> BaseNormalizer:
    normalizer = _REGISTRY.get(source_type)
    if normalizer is None:
        raise KeyError(
            f"No normalizer registered for source_type='{source_type}'. "
            f"Supported: {SUPPORTED_SOURCE_TYPES}"
        )
    return normalizer
