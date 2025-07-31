import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// TypeScript prop interface for createElement
interface GmpxPlaceAutocompleteProps {
  id?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  onPlaceChange?: (event: CustomEvent) => void;
}

const FallbackAutocomplete = dynamic(() => import("./FallbackAutocomplete"), { ssr: false });

export default function AddressAutocomplete({
  onSelect,
}: {
  onSelect: (meta: { address: string; lat: number; lng: number }) => void;
}) {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const { load } = await import('@googlemaps/extended-component-library');
        await load({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' });
        const supportsGmpx = !!customElements.get("gmpx-place-autocomplete");
        setUseFallback(!supportsGmpx);
      } catch (error) {
        console.error("Failed to load Google Maps:", error);
        setUseFallback(true);
      }
    };
    loadGoogleMaps();
  }, []);

  if (useFallback) {
    return <FallbackAutocomplete onSelect={onSelect} />;
  }

  return React.createElement<GmpxPlaceAutocompleteProps>("gmpx-place-autocomplete", {
    id: "smart-gmpx",
    placeholder: "Enter site address",
    style: { width: "100%" },
    onPlaceChange: (event: CustomEvent) => {
      const place = (event as any).detail?.place;
      if (place?.geometry?.location) {
        onSelect({
          address: place.formatted_address || "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    },
  });
}
