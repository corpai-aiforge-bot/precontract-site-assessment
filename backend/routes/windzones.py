from fastapi import APIRouter
from supabase import create_client
import os

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
TABLE_NAME = "windzones"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.get("/windzones")
def get_windzones():
    try:
        response = supabase.table(TABLE_NAME).select("*").execute()
        return response.data
    except Exception as e:
        return {"error": str(e)}
