# backend/routes/geocode.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/geocode")
def get_geocode():
    return {"message": "Geocode route is active"}
