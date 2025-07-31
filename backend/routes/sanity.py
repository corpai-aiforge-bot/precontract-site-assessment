from fastapi import APIRouter
from utils.supabase_client import supabase

router = APIRouter()

@router.get("/sanity-check")
async def sanity_check():
    result = supabase \
        .table("councils_by_postcode") \
        .select("lga_region") \
        .eq("postcode", "5173") \
        .maybe_single()

    # Supabase Python client returns a `Result` object
    if result.data is None:
        return {"status": "fail", "reason": "postcode 5173 missing"}
    if not isinstance(result.data.get("lga_region"), str):
        return {"status": "fail", "reason": "lga_region not a string"}

    return {"status": "pass"}
