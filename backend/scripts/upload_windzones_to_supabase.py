import geopandas as gpd
from shapely.geometry import MultiPolygon, Polygon
from supabase import create_client, Client
import os
import warnings

# === CONFIG ===
GEOJSON_PATH = r"C:\Users\denni\Downloads\storgeojson\as1170windzones.geojson"

SUPABASE_URL = "https://hvdfalenoiycdvktnmkh.supabase.co"  # <-- Your Supabase project URL
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2ZGZhbGVub2l5Y2R2a3RubWtoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzgxMDE5OCwiZXhwIjoyMDY5Mzg2MTk4fQ.T54ZBEvnwJkBRo2AX4eQZrttW6epr2U6JA2eHQwv-GM"     # <-- Your service role key (shortened here)
TABLE_NAME = "windzones"
BATCH_SIZE = 50

# === INIT SUPABASE ===
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# === LOAD GEOJSON ===
print(f"Loading GeoJSON: {GEOJSON_PATH}")
with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    gdf = gpd.read_file(GEOJSON_PATH)

# === Reproject to WGS84 ===
gdf = gdf.to_crs(epsg=4326)

# === Ensure geometries are MultiPolygon ===
def force_multipolygon(geom):
    if isinstance(geom, Polygon):
        return MultiPolygon([geom])
    return geom

gdf['geometry'] = gdf['geometry'].apply(force_multipolygon)

# === Convert geometry to WKT for Supabase upload ===
gdf['geom'] = gdf['geometry'].apply(lambda x: x.wkt)
gdf = gdf.drop(columns='geometry')

# === Ensure unique IDs ===
if 'id' not in gdf.columns or gdf['id'].duplicated().any():
    print("⚠ Duplicate or missing IDs found. Assigning new unique IDs.")
    gdf['id'] = range(1, len(gdf) + 1)

# === CHUNKED UPLOAD ===
print(f"Uploading {len(gdf)} records to Supabase table '{TABLE_NAME}' in chunks of {BATCH_SIZE}...")

for i in range(0, len(gdf), BATCH_SIZE):
    chunk = gdf.iloc[i:i + BATCH_SIZE].to_dict(orient='records')
    try:
        response = supabase.table(TABLE_NAME).insert(chunk).execute()
        if hasattr(response, "data") and response.data:
            print(f"✅ Inserted records {i} to {i + len(chunk)}")
        else:
            print(f"❌ Insert failed for records {i} to {i + len(chunk)} — {response}")
    except Exception as e:
        print(f"❌ Error on records {i} to {i + len(chunk)}: {str(e)}")

print("✅ Upload complete.")
