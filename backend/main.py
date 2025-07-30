# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import submit, benchmark, elevation, geocode, report,report_pdf




app = FastAPI()

# Allow all origins for development (lock down in production!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all route modules
app.include_router(report_pdf.router)
app.include_router(submit.router)
app.include_router(benchmark.router)
app.include_router(elevation.router)
app.include_router(geocode.router)
app.include_router(report.router)
