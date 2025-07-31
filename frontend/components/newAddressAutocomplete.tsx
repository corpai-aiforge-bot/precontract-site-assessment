// components/newAddressAutocomplete.tsx
import { useEffect, useRef, useState } from 'react';
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
  const [manualMode, setManualMode] = useState(false);
  const mapsStatus = useScriptStatus(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`
  );

  useEffect(() => {
    if (mapsStatus !== 'ready' || !window.google || !window.google.maps || !window.google.maps.places || !inputRef.current) {
      if (mapsStatus === 'error') {
        console.error('Google Maps script failed to load or Places API unavailable. Check API key, Places API status, or billing account.');
      }
      return;
    }

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['formatted_address', 'geometry', 'address_components'],
        types: ['address'],
        componentRestrictions: { country: 'au' },
      });

      const listener = autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location || !place.formatted_address) {
          console.warn('No geometry or formatted address in selected place');
          return;
        }

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
    } catch (err) {
      console.error('Error initializing Autocomplete:', err);
    }
  }, [mapsStatus, onSelect]);

  const handleManualSubmit = async () => {
    if (!inputRef.current?.value) {
      console.warn('No address entered in manual mode');
      return;
    }

    const address = inputRef.current.value;
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        }`
      );
      const json = await res.json();
      if (json.status !== 'OK' || !json.results[0]?.geometry?.location) {
        console.error(`Geocoding failed for address "${address}": ${json.status}`);
        onSelect({
          address,
          lat: 0,
          lng: 0,
          suburb: '',
          postcode: '',
          state: '',
          country: 'Australia',
        });
        return;
      }

      const { lat, lng } = json.results[0].geometry.location;
      onSelect({
        address,
        lat,
        lng,
        suburb: extractComponent(json.results[0], 'locality'),
        postcode: extractComponent(json.results[0], 'postal_code'),
        state: extractComponent(json.results[0], 'administrative_area_level_1'),
        country: extractComponent(json.results[0], 'country') || 'Australia',
      });
    } catch (err) {
      console.error(`Error geocoding manual address "${address}":`, err);
      onSelect({
        address,
        lat: 0,
        lng: 0,
        suburb: '',
        postcode: '',
        state: '',
        country: 'Australia',
      });
    }
  };

  return (
    <div>
      {mapsStatus === 'error' && (
        <div>
          <p className="map-warning">
            ⚠️ Map-based lookups unavailable. Possible causes: invalid API key, Places API not enabled, or network error.
          </p>
          <button onClick={() => setManualMode(true)}>Switch to manual input</button>
        </div>
      )}
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter site address"
        disabled={mapsStatus !== 'ready' && !manualMode}
        className="form-input pac-container"
      />
      {manualMode && (
        <button onClick={handleManualSubmit}>Submit Manual Address</button>
      )}
    </div>
  );
}

function extractComponent(place: google.maps.places.PlaceResult, type: string): string | undefined {
  const component = place.address_components?.find((c) => c.types.includes(type));
  return component?.long_name;
}