import json
import csv
from pathlib import Path

# Use your exact file paths
INPUT_FILE = r"C:\Users\denni\Downloads\South Australian SurveyMarks_geojson\SurveyMarks_GDA2020.geojson"
OUTPUT_FILE = r"C:\Users\denni\PycharmProjects\PreContract_Site_Assessment\backend\data\full_survey_benchmarks.csv"

# Load GeoJSON
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    geojson = json.load(f)

# Collect all unique property keys
all_headers = set()
for feature in geojson["features"]:
    props = feature.get("properties", {})
    all_headers.update(props.keys())

# Add geometry fields
all_headers.update(["lat", "lng"])
all_headers = sorted(all_headers)

# Write full CSV
with open(OUTPUT_FILE, "w", newline='', encoding="utf-8") as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=all_headers)
    writer.writeheader()

    for feature in geojson["features"]:
        props = feature.get("properties", {})
        geom = feature.get("geometry", {})
        coords = geom.get("coordinates", [])

        if not coords:
            continue

        row = {key: props.get(key, "") for key in all_headers}
        row["lng"] = coords[0]
        row["lat"] = coords[1]

        writer.writerow(row)

print(f"✅ Done! Wrote {len(geojson['features'])} rows to:\n{OUTPUT_FILE}")
