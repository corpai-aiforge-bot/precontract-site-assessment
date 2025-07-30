# backend/routes/report.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/report")
def get_report():
    return {"message": "Report route is active"}
