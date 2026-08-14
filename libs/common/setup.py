from setuptools import setup, find_packages

setup(
    name="sentinelchain-common",
    version="0.1.0",
    description="Shared response envelope, pagination, and error classes for Sentinel Chain services",
    packages=find_packages(),
    install_requires=["fastapi>=0.115", "pydantic>=2.9"],
    python_requires=">=3.12",
)
