// components/WindzoneOverlay.tsx
import { useEffect, useState } from 'react';

interface WindZone {
  id: string;
  name: string;
  region?: string;
}

export default function WindzoneOverlay() {
  const [windzones, setWindzones] = useState<WindZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWindzones = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/windzones', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        setWindzones(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Failed to load windzones:', err);
        setError('Unable to load wind zones. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWindzones();
  }, []);

  if (loading) {
    return (
      <div>
        <h2>Wind Zones</h2>
        <p>Loading wind zones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Wind Zones</h2>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Wind Zones</h2>
      {windzones.length > 0 ? (
        <ul>
          {windzones.map((zone) => (
            <li key={zone.id}>
              {zone.name} {zone.region ? `(${zone.region})` : ''}
            </li>
          ))}
        </ul>
      ) : (
        <p>No wind zones available.</p>
      )}
    </div>
  );
}