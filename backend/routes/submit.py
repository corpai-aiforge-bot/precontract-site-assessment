# backend/routes/submit.py

from fastapi import APIRouter, Request
from datetime import datetime
import os
from supabase import create_client, Client

router = APIRouter()

# Use your environment variables or fallback to defaults
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/submit")
async def submit_project(request: Request):
    try:
        body = await request.json()

        metadata = body.get("metadata", {})
        services = body.get("services", [])

        data = {
            **metadata,
            "services": ", ".join(services),
            "submitted_at": datetime.utcnow().isoformat()
        }

        response = supabase.table("projects").insert(data).execute()

        if response.error:
            return {"success": False, "error": response.error.message}

        return {"success": True, "data": response.data}
    except Exception as e:
        return {"success": False, "error": str(e)}
