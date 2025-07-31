from fastapi import APIRouter, Request, HTTPException
from utils.google_maps import get_distance_to_coast

router = APIRouter()

@router.get("/api/proximity")
@router.post("/api/proximity")
async def get_distance(request: Request):
    # Handle GET parameters or POST JSON body
    if request.method == "GET":
        lat = request.query_params.get("lat")
        lng = request.query_params.get("lng")
    else:  # POST
        data = await request.json()
        lat = data.get("lat")
        lng = data.get("lng")

    if lat is None or lng is None:
        raise HTTPException(status_code=400, detail="lat and lng required")

    try:
        lat = float(lat)
        lng = float(lng)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid lat or lng")

    distance_m = get_distance_to_coast(lat, lng) * 1000  # Convert km to meters
    return {"distance": distance_m}