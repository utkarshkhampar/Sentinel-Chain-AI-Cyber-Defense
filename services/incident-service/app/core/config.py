from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    SERVICE_NAME: str = "incident-service"
    ENVIRONMENT: str = "local"
    DEBUG: bool = True

    DATABASE_URL: str = "postgresql+psycopg://sentinel:sentinel@localhost:5432/sentinel_incidents"
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    # Internal call to the Blockchain Service when an incident is confirmed
    # (roadmap Chapter 9.4, step 1). Empty by default so this slice runs
    # without the Blockchain Service present; Sprint 4 wires this for real.
    BLOCKCHAIN_SERVICE_URL: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()
