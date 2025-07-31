import { useEffect, useRef } from 'react';

interface AddressMetadata {
  address: string;
  lat: number;
  lng: number;
  postcode?: string;
  suburb?: string;
  state?: string;
  country?: string;
}

export default function NewAddressAutocomplete({ onSelect }: { onSelect: (meta: AddressMetadata) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
      types: ['address'],
      componentRestrictions: { country: 'au' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const metadata: AddressMetadata = {
        address: place.formatted_address || '',
        lat,
        lng,
        postcode: getAddressPart(place, 'postal_code'),
        suburb: getAddressPart(place, 'locality'),
        state: getAddressPart(place, 'administrative_area_level_1'),
        country: getAddressPart(place, 'country'),
      };

      onSelect(metadata);
    });
  }, []);

  return <input ref={inputRef} placeholder="Enter site address" className="address-input" />;
}

function getAddressPart(place: google.maps.places.PlaceResult, type: string): string | undefined {
  return place.address_components?.find((c) => c.types.includes(type))?.long_name;
}
