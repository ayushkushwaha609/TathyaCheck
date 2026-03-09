FROM python:3.11-slim

# Install ffmpeg (needed for Instagram audio extraction)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.deploy.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .

EXPOSE 8001

# gunicorn with uvicorn workers for production concurrency
# - 4 workers (override with WEB_CONCURRENCY env var on your host)
# - max-requests to recycle workers and prevent memory leaks
# - 300s timeout for long-running fact-check pipelines
CMD ["gunicorn", "server:app", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--workers", "4", \
     "--bind", "0.0.0.0:8001", \
     "--timeout", "300", \
     "--graceful-timeout", "30", \
     "--keep-alive", "5", \
     "--max-requests", "500", \
     "--max-requests-jitter", "50", \
     "--access-logfile", "-"]
