import { Dispatch, SetStateAction } from 'react';

interface ProjectMetadata {
  project_name: string;
  lot_number: string;
  council: string;
  address: string;
}

interface Props {
  metadata: ProjectMetadata;
  setMetadata: Dispatch<SetStateAction<ProjectMetadata>>;
}

export default function ProjectMetadataForm({ metadata, setMetadata }: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">📋 Project Metadata</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={metadata.project_name}
            onChange={(e) => setMetadata(prev => ({ ...prev, project_name: e.target.value }))}
            placeholder="Enter project name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lot Number</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={metadata.lot_number}
            onChange={(e) => setMetadata(prev => ({ ...prev, lot_number: e.target.value }))}
            placeholder="Enter lot number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Council</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={metadata.council}
            onChange={(e) => setMetadata(prev => ({ ...prev, council: e.target.value }))}
            placeholder="Enter council name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={metadata.address}
            onChange={(e) => setMetadata(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Enter address"
          />
        </div>
      </div>
    </div>
  );
}
