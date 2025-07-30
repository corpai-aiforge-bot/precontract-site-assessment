import math
import csv
from pathlib import Path

BENCHMARK_CSV = Path(__file__).parent.parent / "data" / "benchmarks.csv"

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * \
        math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def find_nearest_benchmarks(lat, lng, limit=2):
    with open(BENCHMARK_CSV, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        benchmarks = []
        for row in reader:
            b_lat = float(row["lat"])
            b_lng = float(row["lng"])
            dist = haversine(lat, lng, b_lat, b_lng)
            benchmarks.append({
                "id": row["id"],
                "lat": b_lat,
                "lng": b_lng,
                "elevation": float(row["elevation"]),
                "distance_km": dist
            })
        return sorted(benchmarks, key=lambda x: x["distance_km"])[:limit]
