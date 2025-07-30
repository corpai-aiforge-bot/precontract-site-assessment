from fastapi import APIRouter, Request
from utils.google_maps import get_distance_to_coast

router = APIRouter()

@router.post("/proximity")
async def get_distance(request: Request):
    data = await request.json()
    lat = data.get("lat")
    lng = data.get("lng")

    if lat is None or lng is None:
        return {"error": "lat/lng required"}, 400

    distance_km = get_distance_to_coast(lat, lng)
    return {"distance_km": distance_km}
