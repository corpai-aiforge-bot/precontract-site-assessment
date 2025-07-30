// frontend/components/addressAutocomplete.tsx
import React, { useEffect, useRef } from 'react';

interface AddressMetadata {
  address: string;
  lat: number;
  lng: number;
  council?: string;
  elevation?: number;
  distanceToCoast?: number;
}

export default function AddressAutocomplete({
  onSelect,
}: {
  onSelect: (meta: AddressMetadata) => void;
}) {
  const autoRef = useRef<any>(null);

  useEffect(() => {
    const el = autoRef.current;
    if (!el) return;

    const handlePlaceSelect = async (event: any) => {
      const place = event.detail;
      if (!place || !place.geometry || !place.geometry.location) return;

      const address = place.formatted_address || place.displayName || '';
      const lat = place.geometry.location.lat;
      const lng = place.geometry.location.lng;

      try {
        const [geoRes, elevRes, proxRes] = await Promise.all([
          fetch('/api/geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng }),
          }).then((r) => r.json()),
          fetch('/api/elevation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng }),
          }).then((r) => r.json()),
          fetch('/api/proximity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng }),
          }).then((r) => r.json()),
        ]);

        const council = geoRes.council ?? '';
        const elevation = elevRes.elevation ?? null;
        const distanceToCoast = proxRes.distance_km ?? null;

        onSelect({ address, lat, lng, council, elevation, distanceToCoast });
      } catch (error) {
        console.error('Address metadata lookup failed:', error);
        onSelect({ address, lat, lng });
      }
    };

    el.addEventListener('gmpx-place-select', handlePlaceSelect);
    return () => {
      el.removeEventListener('gmpx-place-select', handlePlaceSelect);
    };
  }, [onSelect]);

  return (
    <div className="w-full">
      <gmpx-place-autocomplete
        ref={autoRef}
        style={{ width: '100%' }}
        placeholder="Enter site address"
      ></gmpx-place-autocomplete>
    </div>
  );
}
