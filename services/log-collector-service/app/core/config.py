from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    SERVICE_NAME: str = "log-collector-service"
    ENVIRONMENT: str = "local"
    DEBUG: bool = True

    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    # Scoped API key collectors/shippers authenticate with (roadmap 6.5) —
    # distinct from user JWTs. In production this is looked up per-key
    # against the Configuration Service; a single shared key is enough for
    # this local-dev slice.
    INGEST_API_KEY: str = "local-dev-ingest-key"


@lru_cache
def get_settings() -> Settings:
    return Settings()
