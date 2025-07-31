import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Fallback autocomplete if <gmpx-place-autocomplete> is unsupported
const FallbackAutocomplete = dynamic(() => import("./FallbackAutocomplete"), { ssr: false });

// TypeScript-safe props for fallback
interface Props {
  onSelect: (meta: { address: string; lat: number; lng: number }) => void;
}

export default function AddressAutocomplete({ onSelect }: Props) {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const supportsGmpx =
      typeof window !== "undefined" && !!customElements.get("gmpx-place-autocomplete");
    setUseFallback(!supportsGmpx);
  }, []);

  if (useFallback) {
    return <FallbackAutocomplete onSelect={onSelect} />;
  }

  return React.createElement("gmpx-place-autocomplete", {
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
