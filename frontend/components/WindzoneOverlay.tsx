// components/WindzoneOverlay.tsx
import { useEffect, useState } from "react";

export default function WindzoneOverlay() {
  const [windzones, setWindzones] = useState([]);

  useEffect(() => {
    fetch("/api/windzones")
      .then(res => res.json())
      .then(data => setWindzones(data))
      .catch(err => console.error("Failed to load windzones:", err));
  }, []);

  return (
    <div>
      <h2>Wind Zones</h2>
      <pre>{JSON.stringify(windzones, null, 2)}</pre>
    </div>
  );
}
