import { Dispatch, SetStateAction } from 'react';

interface Props {
  selectedServices: string[];
  setSelectedServices: Dispatch<SetStateAction<string[]>>;
}

const allServices = [
  'Soil Testing',
  'Contour & Feature Survey',
  'Wind Rating',
  'Bushfire (BAL) Assessment',
  'Flood Risk Mapping',
  'Slope Stability',
  'Driveway Feasibility',
];

export default function ServiceChecklist({ selectedServices, setSelectedServices }: Props) {
  function toggleService(service: string) {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">🛠️ Services Requested</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {allServices.map(service => (
          <label key={service} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedServices.includes(service)}
              onChange={() => toggleService(service)}
              className="accent-blue-600"
            />
            <span>{service}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
