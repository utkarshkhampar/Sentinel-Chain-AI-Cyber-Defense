from setuptools import setup, find_packages

setup(
    name="sentinelchain-events",
    version="0.1.0",
    description="Shared Kafka topic names and typed event schemas for Sentinel Chain services",
    packages=find_packages(),
    install_requires=["pydantic>=2.9", "confluent-kafka>=2.5"],
    python_requires=">=3.12",
)
