# backend/routes/elevation.py
from fastapi import APIRouter, Request
from backend.utils.elevation_logic import get_elevation_from_google

router = APIRouter()

@router.post("/elevation")
async def get_elevation(request: Request):
    data = await request.json()
    lat = data.get("lat")
    lng = data.get("lng")

    if lat is None or lng is None:
        return {"error": "lat and lng required"}, 400

    elevation = get_elevation_from_google(lat, lng)
    return {"elevation": elevation}
