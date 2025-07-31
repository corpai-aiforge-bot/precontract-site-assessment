// components/newAddressAutocomplete.tsx
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/utils/useDebounce';
import { useScriptStatus } from '@/utils/useScriptStatus';

interface AddressMetadata {
  address: string;
  lat: number;
  lng: number;
  suburb?: string;
  postcode?: string;
  state?: string;
  country?: string;
}

interface Props {
  onSelect: (meta: AddressMetadata) => void;
}

export default function NewAddressAutocomplete({ onSelect }: Props) {
  const [input, setInput] = useState('');
  const [warning, setWarning] = useState('');
  const debouncedInput = useDebounce(input, 400);
  const autocompleteRef = useRef<HTMLInputElement>(null);

  const mapsStatus = useScriptStatus(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly&region=AU`
  );

  useEffect(() => {
    if (mapsStatus !== 'ready') return;
    if (!autocompleteRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current!, {
      fields: ['formatted_address', 'geometry', 'address_components'],
      types: ['geocode'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.formatted_address) return;

      const lat = place.geometry.location?.lat?.() ?? 0;
      const lng = place.geometry.location?.lng?.() ?? 0;
      const components = place.address_components ?? [];

      const getComponent = (type: string) => components.find((c) => c.types.includes(type))?.long_name || '';

      const meta: AddressMetadata = {
        address: place.formatted_address,
        lat,
        lng,
        suburb: getComponent('locality'),
        postcode: getComponent('postal_code'),
        state: getComponent('administrative_area_level_1'),
        country: getComponent('country'),
      };

      onSelect(meta);
    });
  }, [mapsStatus]);

  useEffect(() => {
    if (mapsStatus === 'error') {
      setWarning('⚠️ Map-based lookups are unavailable — manual address input only.');
    }
  }, [mapsStatus]);

  return (
    <div>
      {mapsStatus === 'error' && <p className="map-warning">{warning}</p>}
      <input
        ref={autocompleteRef}
        type="text"
        placeholder="Enter site address"
        disabled={mapsStatus !== 'ready'}
        className="form-input"
      />
    </div>




  );
}
