# backend/utils/supabase_client.py
import os
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Use service role key for admin-level access

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
