# syntax=docker/dockerfile:1
FROM python:3.12-slim AS base

RUN groupadd -r sentinel && useradd -r -g sentinel sentinel
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc curl \
    && rm -rf /var/lib/apt/lists/*

COPY libs /libs
COPY services/log-collector-service/requirements.txt .
RUN pip install --no-cache-dir --break-system-packages -r requirements.txt

COPY services/log-collector-service/app ./app

USER sentinel
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
