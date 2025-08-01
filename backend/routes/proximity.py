# backend/routes/proximity.py
from fastapi import APIRouter
from utils.haversine import haversine_distance

router = APIRouter()

@router.get("/proximity")
async def get_distance(lat: float, lng: float):
    # For now, hardcode a mock coastal point (e.g., Glenelg SA)
    coast_lat, coast_lng = -34.98, 138.50
    distance_km = haversine_distance(lat, lng, coast_lat, coast_lng)
    return {"distance": distance_km}
