// components/newAddressAutocomplete.tsx
import { useEffect, useRef } from 'react';
import Script from 'next/script';
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapsStatus = useScriptStatus(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly&loading=async`
  );

  useEffect(() => {
    if (mapsStatus !== 'ready' || !window.google || !window.google.maps || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry', 'address_components'],
      types: ['address'],
      componentRestrictions: { country: 'au' },
    });

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location || !place.formatted_address) return;

      const meta: AddressMetadata = {
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        suburb: extractComponent(place, 'locality'),
        postcode: extractComponent(place, 'postal_code'),
        state: extractComponent(place, 'administrative_area_level_1'),
        country: extractComponent(place, 'country'),
      };

      onSelect(meta);
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [mapsStatus, onSelect]);

  return (
    <div>
      {mapsStatus === 'error' && (
        <p className="map-warning">
          ⚠️ Map-based lookups are unavailable — manual address input only.
        </p>
      )}
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter site address"
        disabled={mapsStatus !== 'ready'}
        className="form-input pac-container"
      />
    </div>
  );
}

function extractComponent(place: google.maps.places.PlaceResult, type: string): string | undefined {
  const component = place.address_components?.find((c) => c.types.includes(type));
  return component?.long_name;
}