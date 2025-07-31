# convert-windzones.py
import json
import csv
from pathlib import Path

INPUT_FILE = r"C:\Users\denni\Downloads\1170 windzones ausralia 146359_01_0\as1170windzones.json"
OUTPUT_FILE = r"C:\Users\denni\PycharmProjects\PreContract_Site_Assessment\backend\data\as1170_windzones.csv"

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    geojson = json.load(f)

headers = set()
for feature in geojson["features"]:
    headers.update(feature.get("properties", {}).keys())
headers.update(["lat", "lng"])
headers = sorted(headers)

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=headers)
    writer.writeheader()

    for feature in geojson["features"]:
        props = feature.get("properties", {})
        coords = feature.get("geometry", {}).get("coordinates", [])
        if not coords:
            continue

        row = {key: props.get(key, "") for key in headers}

        # Handle polygon geometry for centroid extraction
        if feature["geometry"]["type"] == "Polygon":
            lngs = [pt[0] for pt in coords[0]]
            lats = [pt[1] for pt in coords[0]]
            row["lng"] = sum(lngs) / len(lngs)
            row["lat"] = sum(lats) / len(lats)
        else:
            row["lng"] = coords[0]
            row["lat"] = coords[1]

        writer.writerow(row)

print(f"✅ Converted {len(geojson['features'])} features to CSV.")
print(f"📄 Output: {OUTPUT_FILE}")
