from .haversine import haversine

# Comprehensive coastal points for Australian states and territories (lat, lng)
AUSTRALIA_COASTAL_POINTS = [
    # New South Wales (NSW)
    (-33.8688, 151.2093),  # Sydney (Bondi Beach)
    (-28.0003, 153.4310),  # Byron Bay
    (-36.1148, 150.1333),  # Batemans Bay
    (-32.9271, 151.7765),  # Newcastle
    (-34.4240, 150.8935),  # Wollongong
    # Victoria (VIC)
    (-37.8136, 144.9631),  # Melbourne (Port Phillip Bay)
    (-38.3460, 141.6067),  # Warrnambool
    (-38.1471, 144.3607),  # Geelong
    (-38.4808, 142.2364),  # Port Campbell
    (-38.7500, 143.6694),  # Apollo Bay
    # Queensland (QLD)
    (-27.4698, 153.0251),  # Brisbane (Moreton Bay)
    (-16.9186, 145.7781),  # Cairns
    (-20.2827, 148.0409),  # Airlie Beach
    (-19.2664, 146.8057),  # Townsville
    (-28.0167, 153.4000),  # Gold Coast
    # South Australia (SA)
    (-34.9285, 138.6007),  # Adelaide (Gulf St Vincent)
    (-35.2809, 138.4570),  # Victor Harbor
    (-36.8378, 139.8532),  # Robe
    (-37.8281, 140.7750),  # Mount Gambier
    (-35.0703, 137.5240),  # Kangaroo Island
    # Western Australia (WA)
    (-31.9505, 115.8605),  # Perth (Fremantle)
    (-17.9640, 122.2306),  # Broome
    (-33.3256, 115.6370),  # Bunbury
    (-21.6403, 115.1103),  # Exmouth
    (-35.0235, 117.8840),  # Albany
    # Tasmania (TAS)
    (-42.8821, 147.3272),  # Hobart
    (-41.4385, 147.1347),  # Launceston (Tamar River)
    (-40.8510, 145.2564),  # Burnie
    (-41.0503, 145.9050),  # Devonport
    # Northern Territory (NT)
    (-12.4634, 130.8456),  # Darwin
    (-11.0076, 132.1470),  # Melville Island
    (-12.1860, 136.6860),  # Nhulunbuy
    # External Territories
    (-29.0400, 167.9547),  # Norfolk Island
    (-10.4875, 105.6391),  # Christmas Island
    (-12.1568, 96.8225),   # Cocos (Keeling) Islands
]

def get_distance_to_coast(lat: float, lng: float) -> float:
    """
    Calculate distance to nearest coastal point in kilometers.
    Args:
        lat: Latitude of the input point.
        lng: Longitude of the input point.
    Returns:
        Distance in kilometers to the nearest coastal point.
    """
    min_distance = float('inf')
    # Filter points within ±5 degrees for performance
    nearby_points = [
        (c_lat, c_lng)
        for c_lat, c_lng in AUSTRALIA_COASTAL_POINTS
        if abs(c_lat - lat) < 5 and abs(c_lng - lng) < 5
    ]
    for coast_lat, coast_lng in nearby_points or AUSTRALIA_COASTAL_POINTS:
        distance = haversine(lat, lng, coast_lat, coast_lng)
        min_distance = min(min_distance, distance)
    return min_distance