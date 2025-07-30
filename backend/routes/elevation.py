# backend/routes/elevation.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/elevation")
def get_elevation():
    return {"message": "Elevation route is active"}
