from setuptools import setup, find_packages

setup(
    name="sentinelchain-auth-client",
    version="0.1.0",
    description="Shared JWT validation and RBAC dependency for Sentinel Chain services",
    packages=find_packages(),
    install_requires=["fastapi>=0.115", "python-jose[cryptography]>=3.3", "pydantic>=2.9", "sentinelchain-common"],
    python_requires=">=3.12",
)
