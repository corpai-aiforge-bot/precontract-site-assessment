# backend/routes/benchmark.py
from fastapi import APIRouter, Request
from supabase import create_client
import os

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/api/benchmarks")
async def get_benchmarks(request: Request):
    data = await request.json()
    suburb = data.get("suburb")
    postcode = data.get("postcode")

    if not suburb or not postcode:
        return {"error": "suburb and postcode are required"}, 400

    result = supabase.from_("survey_benchmarks_sa") \
        .select("benchmark1, benchmark2") \
        .eq("suburb", suburb) \
        .eq("postcode", postcode) \
        .limit(1) \
        .execute()

    if result.data and len(result.data) > 0:
        return result.data[0]
    else:
        return {"benchmark1": None, "benchmark2": None}
