// components/ProjectMetadataForm.tsx

import React from 'react';

interface Props {
  formData: {
    projectName: string;
    lotNumber: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function ProjectMetadataForm({ formData, onChange }: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Project Metadata</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="projectName"
          placeholder="Project Name"
          value={formData.projectName}
          onChange={onChange}
          className="border rounded p-2 w-full"
        />
        <input
          type="text"
          name="lotNumber"
          placeholder="Lot Number"
          value={formData.lotNumber}
          onChange={onChange}
          className="border rounded p-2 w-full"
        />
      </div>
    </div>
  );
}
