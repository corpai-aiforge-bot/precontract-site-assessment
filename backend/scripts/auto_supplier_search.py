# backend/scripts/auto_supplier_search.py
import requests
import time
from typing import List
import os
from supabase import create_client, Client

# Load Supabase credentials from environment
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Use secure service role key

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


SERPAPI_KEY = os.getenv('SERPAPI_KEY')

if not SERPAPI_KEY:
    raise ValueError("Missing or invalid SERPAPI_KEY. Check your environment or .env.")

def search_local_suppliers(service_type: str, suburb: str, state: str) -> List[dict]:
    headers = {
        'User-Agent': 'Mozilla/5.0'
    }
    query = f"{service_type} services near {suburb}, {state}"
    params = {
        'q': query,
        'num': 5,
        'hl': 'en',
        'api_key': SERPAPI_KEY  # ✅ Now valid
    }

    response = requests.get('https://serpapi.com/search.json', params=params, headers=headers)

    if response.status_code != 200:
        print("Failed to fetch results", response.text)
        return []

    results_json = response.json()
    local_results = results_json.get("local_results", [])

    if not isinstance(local_results, list):
        print("Error from API:", results_json.get("error") or results_json)
        return []

    results = []
    for result in local_results[:5]:
        results.append({
            'service_type': service_type,
            'business_name': result.get('title'),
            'suburb': suburb,
            'state': state,
            'email': result.get('email'),
            'phone': result.get('phone'),
            'source_url': result.get('link')
        })

    for supplier in results:
        try:
            supabase.table("suppliers").insert(supplier).execute()
        except Exception as e:
            print(f"Failed to insert supplier: {supplier['business_name']} — {e}")

    return results


# Example usage:
if __name__ == '__main__':
    suppliers = search_local_suppliers("soil test", "Aldinga Beach", "SA")
    for s in suppliers:
        print(s)
    time.sleep(1)
