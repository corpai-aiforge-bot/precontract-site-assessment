// utils/elevationFetch.ts

export async function getElevation(lat: number, lon: number): Promise<number | null> {
  try {
    const res = await fetch(`/api/elevation?lat=${lat}&lng=${lon}`);
    const data = await res.json();
    return data.elevation || null;
  } catch (err) {
    return null;
  }
}
