// components/addressAutocomplete.tsx
import React, { useEffect, useRef, useState } from "react";

interface AddressMetadata {
  address: string;
  lat: number;
  lng: number;
  postcode?: string;
  suburb?: string;
  state?: string;
  country?: string;
}

interface Props {
  onSelect: (meta: AddressMetadata) => void;
}

export default function AddressAutocomplete({ onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      console.error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
      return;
    }

    const existing = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existing) {
      existing.addEventListener("load", () => setScriptLoaded(true));
      if ((window as any).google?.maps?.places?.AutocompleteSuggestion) {
        setScriptLoaded(true);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&region=AU`;
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, [apiKey]);

  useEffect(() => {
    if (!scriptLoaded || !inputRef.current) return;

    const autocomplete = new (window as any).google.maps.places.AutocompleteSuggestion(inputRef.current, {
      fields: ["address_components", "formatted_address", "geometry"],
      types: ["geocode"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place || !place.geometry?.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address || "";

      const components = place.address_components || [];
      const get = (type: string) =>
        components.find((c: any) => c.types.includes(type))?.long_name || "";

      onSelect({
        address,
        lat,
        lng,
        postcode: get("postal_code"),
        suburb: get("locality") || get("sublocality"),
        state: get("administrative_area_level_1"),
        country: get("country"),
      });
    });
  }, [scriptLoaded]);

  return (
    <input
      type="text"
      ref={inputRef}
      placeholder="Enter site address"
      className="w-full p-2 border rounded shadow-sm"
    />
  );
}
