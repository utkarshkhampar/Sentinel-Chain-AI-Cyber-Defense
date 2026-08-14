from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Service
    SERVICE_NAME: str = "auth-service"
    ENVIRONMENT: str = "local"  # local | staging | production
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql+psycopg://sentinel:sentinel@localhost:5432/sentinel_auth"

    # Redis (refresh-token denylist, rate limiting)
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT — JWT_SECRET_KEY MUST match libs/auth_client's env in every other
    # service; in staging/production this is injected via Kubernetes Secret,
    # never committed to source control.
    JWT_SECRET_KEY: str = "CHANGE-ME-IN-ENV-NEVER-COMMIT-REAL-SECRET"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # MFA
    MFA_ISSUER_NAME: str = "Sentinel Chain"

    # CORS — the frontend's dev server origin; tightened in production
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
