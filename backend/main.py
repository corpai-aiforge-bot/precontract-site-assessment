# backend/main.py
from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from routes import benchmark, elevation, report,sanity, report_pdf, proximity,windzones  # 👈 Add proximity



app = FastAPI()

# Allow all origins for development (lock down in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "*")],  # ✅ fixed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Mount all API routes under `/api` prefix
app.include_router(benchmark.router, prefix="/api")
app.include_router(elevation.router, prefix="/api")
app.include_router(proximity.router, prefix="/api")  # 👈 Add this
app.include_router(report.router, prefix="/api")
app.include_router(report_pdf.router, prefix="/api")
app.include_router(windzones.router, prefix="/api")
app.include_router(sanity.router, prefix="/api")