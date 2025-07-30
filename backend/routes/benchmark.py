# backend/routes/benchmark.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/benchmark")
def run_benchmark():
    return {"message": "Benchmark route is active"}
