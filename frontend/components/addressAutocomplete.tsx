// components/addressAutocomplete.tsx

import React, { useState } from 'react';
import { GooglePlaceAutocomplete } from 'react-google-place-autocomplete'; // or replace with your component
import axios from 'axios';

interface AddressMetadata {
  address: string;
  lat: number;
  lng: number;
  elevation?: number;
  distanceToCoast?: number;
  council?: string;
  region?: string;
}

interface Props {
  onMetadata: (data: AddressMetadata) => void;
}

const AddressAutocomplete: React.FC<Props> = ({ onMetadata }) => {
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const handleSelect = async (address: string, lat: number, lng: number) => {
    setSelectedAddress(address);

    try {
      const [
        elevationRes,
        proximityRes,
        geocodeRes
      ] = await Promise.all([
        axios.post('/api/elevation', { lat, lng }),
        axios.post('/api/proximity', { lat, lng }),
        axios.post('/api/geocode', { lat, lng })
      ]);

      const metadata: AddressMetadata = {
        address,
        lat,
        lng,
        elevation: elevationRes.data.elevation,
        distanceToCoast: proximityRes.data.distanceToCoast,
        council: geocodeRes.data.council,
        region: geocodeRes.data.region,
      };

      onMetadata(metadata);
    } catch (error) {
      console.error('Error fetching address metadata:', error);
      onMetadata({ address, lat, lng }); // fallback: basic info only
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">📍 Site Address</label>
      <GooglePlaceAutocomplete
        onSelect={({ address, lat, lng }) => handleSelect(address, lat, lng)}
        placeholder="Enter site address"
      />
    </div>
  );
};

export default AddressAutocomplete;
