# backend/routes/benchmark.py
from fastapi import APIRouter, Request
from utils.supabase_client import supabase
from utils.haversine import haversine

router = APIRouter()

@router.post("/benchmarks")
async def get_benchmarks(request: Request):
    try:
        data = await request.json()
        lat = float(data.get("lat"))
        lng = float(data.get("lng"))

        # Get all benchmark rows
        response = supabase.table("survey_benchmarks_sa").select("*").execute()

        if response.error:
            return {"error": str(response.error)}, 500

        all_benchmarks = response.data
        if not all_benchmarks:
            return {"error": "No benchmarks found"}, 404

        # Calculate distances
        enriched = []
        for b in all_benchmarks:
            b_lat = float(b["lat"])
            b_lng = float(b["lng"])
            distance = haversine(lat, lng, b_lat, b_lng)
            enriched.append({**b, "distance_km": distance})

        # Sort and return 2 closest
        closest = sorted(enriched, key=lambda b: b["distance_km"])[:2]
        return {
            "benchmark1": closest[0]["elevation"] if len(closest) > 0 else None,
            "benchmark2": closest[1]["elevation"] if len(closest) > 1 else None,
        }

    except Exception as e:
        return {"error": str(e)}, 500
