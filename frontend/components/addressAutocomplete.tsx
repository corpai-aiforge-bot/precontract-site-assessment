import React, { useEffect, useRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import axios from 'axios';

interface AddressMetadata {
  address: string;
  lat: number;
  lng: number;
  council?: string;
  elevation?: number;
  distanceToCoast?: number;
}

const libraries: ("places")[] = ['places'];

export default function AddressAutocomplete({
  onSelect,
}: {
  onSelect: (meta: AddressMetadata) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
    });

    autocomplete.addListener('place_changed', async () => {
      const place = autocomplete.getPlace();
      const address = place.formatted_address || '';
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();

      if (!lat || !lng) return;

      try {
        const [geoRes, elevRes, proxRes] = await Promise.all([
          axios.post('/api/geocode', { lat, lng }),
          axios.post('/api/elevation', { lat, lng }),
          axios.post('/api/proximity', { lat, lng }),
        ]);

        const council = geoRes.data.council || '';
        const elevation = elevRes.data.elevation || null;
        const distanceToCoast = proxRes.data.distance_km || null;

        onSelect({ address, lat, lng, council, elevation, distanceToCoast });
      } catch (error) {
        console.error('Address metadata lookup failed:', error);
        onSelect({ address, lat, lng }); // fallback with just basic fields
      }
    });
  }, [isLoaded]);

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter site address"
        className="w-full max-w-3xl px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"

      />
    </div>
  );
}
