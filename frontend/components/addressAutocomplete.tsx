import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmpx-place-autocomplete': any;
    }
  }
}


const FallbackAutocomplete = dynamic(() => import("./FallbackAutocomplete"), { ssr: false });

export default function AddressAutocomplete({
  onSelect,
}: {
  onSelect: (meta: { address: string; lat: number; lng: number }) => void;
}) {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const isBrowser = typeof window !== "undefined";
    const supportsGmpx = isBrowser && !!customElements.get("gmpx-place-autocomplete");
    setUseFallback(!supportsGmpx);
  }, []);

  if (useFallback) {
    return <FallbackAutocomplete onSelect={onSelect} />;
  }

  return (
    <gmpx-place-autocomplete
      id="smart-gmpx"
      style={{ width: "100%" }}
      placeholder="Enter site address"
      onPlaceChange={() => {
        const el = document.getElementById("smart-gmpx") as any;
