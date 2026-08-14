from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    SERVICE_NAME: str = "asset-service"
    ENVIRONMENT: str = "local"
    DEBUG: bool = True

    DATABASE_URL: str = "postgresql+psycopg://sentinel:sentinel@localhost:5432/sentinel_assets"
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
