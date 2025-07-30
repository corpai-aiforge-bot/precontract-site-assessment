// components/ProjectMetadataForm.tsx
import React from 'react';

interface FormData {
  projectName: string;
  lotNumber: string;
  [key: string]: any;
}

interface Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ProjectMetadataForm: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Project Details</h2>
      <input
        type="text"
        name="projectName"
        placeholder="Project Name"
        value={formData.projectName}
        onChange={onChange}
        className="border rounded p-2 w-full mb-2"
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
  );
};

export default ProjectMetadataForm;
