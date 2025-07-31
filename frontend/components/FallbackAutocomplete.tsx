import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

export default function FallbackAutocomplete({ onSelect }: { onSelect: (meta: { address: string; lat: number; lng: number }) => void }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    onSelect({ address, lat, lng });
  };

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Enter site address"
        className="w-full p-2 border rounded"
      />
      {status === 'OK' && (
        <ul className="absolute bg-white border w-full z-10 max-h-60 overflow-y-auto mt-1 rounded shadow">
          {data.map(({ description }, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(description)}
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
