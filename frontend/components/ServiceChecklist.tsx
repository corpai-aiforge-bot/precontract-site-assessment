// components/ServiceChecklist.tsx

import React from 'react';

interface Props {
  selectedServices: string[];
  onChange: (services: string[]) => void;
}

const servicesList = [
  'Site Classification',
  'Soil Test',
  'Wind Rating',
  'Bushfire Attack Level (BAL)',
  'Flood Risk Assessment',
  'Environmental Constraints',
];

export default function ServiceChecklist({ selectedServices, onChange }: Props) {
  const toggleService = (service: string) => {
    const updated = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];
    onChange(updated);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Services Requested</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {servicesList.map((service) => (
          <label key={service} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedServices.includes(service)}
              onChange={() => toggleService(service)}
              className="form-checkbox"
            />
            <span>{service}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
