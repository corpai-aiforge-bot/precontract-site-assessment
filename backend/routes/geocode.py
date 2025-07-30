from fastapi import APIRouter, Request
from utils.google_maps import get_council_name

router = APIRouter()

@router.post("/geocode")
async def get_council(request: Request):
    data = await request.json()
    lat = data.get("lat")
    lng = data.get("lng")

    if lat is None or lng is None:
        return {"error": "lat/lng required"}, 400

    council = get_council_name(lat, lng)
    return {"council": council}
