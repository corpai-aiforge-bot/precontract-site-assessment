// frontend/components/newAddressAutocomplete.tsx
import { useEffect, useRef } from "react";

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

export default function NewAddressAutocomplete({ onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      if (customElements.get("gmpx-place-autocomplete")) return;

      const loader = await import("@googlemaps/extended-component-library/loader");
      customElements.define("gmpx-place-autocomplete", loader.PlaceAutocompleteElement);
    };

    load().catch(console.error);
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const handler = (e: any) => {
      const place = e.target?.value;
      if (!place || !place.geometry) return;

      const lat = place.geometry.location.lat;
      const lng = place.geometry.location.lng;
      const address = place.formattedAddress || "";

      const components = place.addressComponents || [];
      const get = (type: string) =>
        components.find((c: any) => c.types.includes(type))?.longText || "";

      onSelect({
        address,
        lat,
        lng,
        postcode: get("postal_code"),
        suburb: get("locality") || get("sublocality"),
        state: get("administrative_area_level_1"),
        country: get("country"),
      });
    };

    root.addEventListener("gmpx-placeautocomplete:placechange", handler);
    return () => root.removeEventListener("gmpx-placeautocomplete:placechange", handler);
  }, [onSelect]);

  return (
    <div ref={containerRef}>
      <gmpx-place-autocomplete
        style={{ display: "block", width: "100%" }}
        placeholder="Enter site address"
        autocomplete-options='{"types": ["geocode"]}'
      />
    </div>
  );
}
