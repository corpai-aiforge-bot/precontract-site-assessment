// utils/proximity.ts

interface Point {
  lat: number;
  lon: number;
}

const coastalPoints: Point[] = [
  { lat: -27.4698, lon: 153.0251 }, // Brisbane
  { lat: -33.8688, lon: 151.2093 }, // Sydney
  { lat: -34.9285, lon: 138.6007 }, // Adelaide
  { lat: -31.9505, lon: 115.8605 }, // Perth
  { lat: -37.8136, lon: 144.9631 }, // Melbourne
  { lat: -42.8821, lon: 147.3272 }, // Hobart
  { lat: -16.9186, lon: 145.7781 }, // Cairns
];

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function calculateDistanceToCoast(lat: number, lon: number): number {
  let min = Infinity;
  for (const point of coastalPoints) {
    const d = haversineDistance(lat, lon, point.lat, point.lon);
    if (d < min) min = d;
  }
  return parseFloat(min.toFixed(1));
}
