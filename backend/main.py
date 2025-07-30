# backend/main.py
import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import benchmark, elevation, geocode, report, report_pdf, proximity  # 👈 Add proximity


app = FastAPI()

# Allow all origins for development (lock down in production)
app.add_middleware(
    CORSMiddleware,
    allowed_origin = os.getenv("FRONTEND_ORIGIN", "*"),  # fallback to wildcard for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Mount all API routes under `/api` prefix
app.include_router(benchmark.router, prefix="/api")
app.include_router(elevation.router, prefix="/api")
app.include_router(geocode.router, prefix="/api")
app.include_router(proximity.router, prefix="/api")  # 👈 Add this
app.include_router(report.router, prefix="/api")
app.include_router(report_pdf.router, prefix="/api")
