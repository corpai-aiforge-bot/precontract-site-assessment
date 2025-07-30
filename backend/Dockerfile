FROM python:3.10-slim

WORKDIR /app

# Copy backend code (from current context — which is already backend/)
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Start FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
