# backend/utils/elevation_logic.py

import os
import requests

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

def get_elevation_from_google(lat, lng):
    if not GOOGLE_MAPS_API_KEY:
        raise ValueError("Missing GOOGLE_MAPS_API_KEY in environment.")

    url = (
        f"https://maps.googleapis.com/maps/api/elevation/json"
        f"?locations={lat},{lng}&key={GOOGLE_MAPS_API_KEY}"
    )

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        if "results" in data and data["results"]:
            return data["results"][0]["elevation"]
        else:
            return None  # No elevation data found

    except requests.RequestException as e:
        print(f"[Elevation API Error] {e}")
        return None
