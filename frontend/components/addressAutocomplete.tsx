// components/AddressAutocomplete.tsx
import { useEffect, useRef } from 'react';

interface Props {
  onSelect: (data: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
}

export default function AddressAutocomplete({ onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;
    if (!inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['geocode'],
      componentRestrictions: { country: 'au' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      onSelect({
        address: place.formatted_address || '',
        lat,
        lng,
      });
    });
  }, []);

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium text-sm">📍 Site Address</label>
      <input
        ref={inputRef}
        type="text"
        placeholder="Start typing address..."
        className="w-full p-2 border border-gray-300 rounded shadow-sm"
      />
    </div>
  );
}
