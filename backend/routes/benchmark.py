# backend/routes/benchmark.py
from fastapi import APIRouter, Request
from utils.benchmark_lookup import find_nearest_benchmarks  # ✅ logic import

router = APIRouter()

@router.post("/benchmarks")
async def get_benchmarks(request: Request):
    data = await request.json()
    lat = data.get("lat")
    lng = data.get("lng")

    if lat is None or lng is None:
        return {"error": "Missing lat/lng"}, 400

    nearest = find_nearest_benchmarks(lat, lng)
    if len(nearest) >= 2:
        return {
            "benchmark1": nearest[0]["elevation"],
            "benchmark2": nearest[1]["elevation"],
        }
    elif len(nearest) == 1:
        return {
            "benchmark1": nearest[0]["elevation"],
            "benchmark2": None,
        }
    else:
        return {
            "benchmark1": None,
            "benchmark2": None,
        }
