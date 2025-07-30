FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for WeasyPrint
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    libcairo2 \
    pango1.0-tools \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libcurl4-openssl-dev \
    && rm -rf /var/lib/apt/lists/*

COPY . /app

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
