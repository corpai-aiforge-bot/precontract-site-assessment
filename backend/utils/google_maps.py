import math

# Coastal points from Claude's model
COASTAL_POINTS = [
    (-27.4698, 153.0251), (-26.6500, 153.0500), (-25.2744, 153.1178),
    (-23.8477, 151.2647), (-20.7256, 149.2950), (-16.9186, 145.7781),
    (-12.4634, 130.8456), (-33.8688, 151.2093), (-31.4321, 152.9015),
    (-28.6474, 153.6020), (-30.2835, 153.1185), (-35.1348, 150.8820),
    (-37.8136, 144.9631), (-38.3553, 142.4849), (-37.5622, 140.9992),
    (-34.9285, 138.6007), (-35.1367, 137.7786), (-32.5062, 137.7717),
    (-31.9505, 115.8605), (-28.7774, 114.6077), (-21.4668, 114.9626),
    (-17.9644, 122.2304), (-42.8821, 147.3272), (-41.4332, 147.1441),
    (-40.8364, 144.6629),
]

def get_distance_to_coast(lat: float, lon: float) -> float:
    """
    Calculates the minimum distance (in kilometers) from a site to any known Australian coastal point.
    Uses the Haversine formula.
    """
    def haversine(lat1, lon1, lat2, lon2):
        R = 6371  # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)

        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) *
             math.cos(math.radians(lat2)) *
             math.sin(dlon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    return min(haversine(lat, lon, cp_lat, cp_lon) for cp_lat, cp_lon in COASTAL_POINTS)
