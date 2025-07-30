from fastapi import APIRouter, Request
from ..utils.benchmark_lookup import find_nearest_benchmarks

router = APIRouter()

@router.post("/benchmark")
async def get_benchmark_slope(request: Request):
    data = await request.json()
    lat = data.get("lat")
    lng = data.get("lng")

    if lat is None or lng is None:
        return {"error": "lat/lng required"}, 400

    points = find_nearest_benchmarks(lat, lng)

    if len(points) < 2:
        return {"error": "Not enough nearby benchmarks found"}, 404

    slope_per_km = (points[1]["elevation"] - points[0]["elevation"]) / (
        points[1]["distance_km"] + 1e-5)

    return {
        "benchmarks": points,
        "estimated_slope_m_per_km": round(slope_per_km, 2),
        "approx_site_grade_direction": "rising" if slope_per_km > 0 else "falling"
    }
