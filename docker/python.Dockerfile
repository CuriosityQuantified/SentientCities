FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src
COPY config ./config

EXPOSE 8080

CMD ["python", "-m", "src.main"]