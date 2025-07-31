from utils.supabase_client import supabase
from utils.haversine import haversine

def find_nearest_benchmarks(lat: float, lng: float) -> list:
    response = supabase.table("survey_benchmarks_sa").select("*").execute()
    if response.error:
        raise Exception(f"Supabase error: {response.error}")

    all_benchmarks = response.data
    if not all_benchmarks:
        return []

    enriched = []
    for b in all_benchmarks:
        b_lat = float(b["lat"])
        b_lng = float(b["lng"])
        distance = haversine(lat, lng, b_lat, b_lng)
        enriched.append({**b, "distance_km": distance})

    closest = sorted(enriched, key=lambda b: b["distance_km"])[:2]
    return closest
