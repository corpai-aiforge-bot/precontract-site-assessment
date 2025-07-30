// pages/ui1.tsx
import { useState } from 'react';
import ProjectMetadataForm from '../components/ProjectMetadataForm';
import ServiceChecklist from '../components/ServiceChecklist';
import AddressAutocomplete from '../components/AddressAutocomplete';
import AdvancedFootingAssessor from '../components/AdvancedFootingAssessor';
import { submitForm } from '../utils/formSubmit';
import { v4 as uuidv4 } from 'uuid';

export default function UI1Page() {
  const [metadata, setMetadata] = useState<any>({});
  const [services, setServices] = useState<string[]>([]);
  const [riskScore, setRiskScore] = useState(82);
  const [riskCategory, setRiskCategory] = useState('LOW RISK – Steel Recommended');
  const [elevation, setElevation] = useState(12.3);
  const [coastalDistance, setCoastalDistance] = useState(2.7);
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    setStatus('Submitting...');
    const result = await submitForm({
      metadata,
      services,
      riskScore,
      riskCategory,
      elevation,
      coastalDistance,
    });
    setStatus(result.success ? 'Submitted successfully!' : `Error: ${result.error}`);
  };

  const loadDemoProject = () => {
    setMetadata({
      first_name: 'Alicia',
      last_name: 'Brown-Test',
      email: 'mcmdennis@gmail.com',
      phone: '+61400111222',
      project_name: 'Demo SDA Site - Magnetic Island',
      lot_number: '',
      council: 'City of Onkaparinga Council',
      address: '36 Story Avenue, Aldinga Beach SA 5173',
      lat: -35.2754,
      lng: 138.4718,
      notes: 'Testing precontract setup',
      soilResistivity: 3500,
      soilPH: 7.2,
      wind: 'offshore',
      topography: 'partial',
      rainfall: 'medium',
      footingCount: 8,
    });
    setServices(['Survey', 'Soil Test', 'BAL Assessment']);
    setRiskScore(82);
    setRiskCategory('LOW RISK – Steel Recommended');
    setElevation(12.3);
    setCoastalDistance(2.7);
    setStatus('Demo project loaded');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">PreContract Site Assessment - UI1</h1>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="text" placeholder="First Name" className="input" value={metadata.first_name || ''} onChange={(e) => setMetadata((prev: any) => ({ ...prev, first_name: e.target.value }))} />
        <input type="text" placeholder="Last Name" className="input" value={metadata.last_name || ''} onChange={(e) => setMetadata((prev: any) => ({ ...prev, last_name: e.target.value }))} />
        <input type="email" placeholder="Email" className="input" value={metadata.email || ''} onChange={(e) => setMetadata((prev: any) => ({ ...prev, email: e.target.value }))} />
        <input type="tel" placeholder="Phone Number" className="input" value={metadata.phone || ''} onChange={(e) => setMetadata((prev: any) => ({ ...prev, phone: e.target.value }))} />
      </div>

      <AddressAutocomplete
        onSelect={({ address, lat, lng }) =>
          setMetadata((prev: any) => ({ ...prev, address, lat, lng }))
        }
      />

      <ProjectMetadataForm onChange={setMetadata} />
      <ServiceChecklist selected={services} onChange={setServices} />

      {metadata.lat && metadata.lng && (
        <AdvancedFootingAssessor
          lat={metadata.lat}
          lon={metadata.lng}
          resistivity={metadata.soilResistivity || 0}
          soilPH={metadata.soilPH || 7}
          wind={metadata.wind || 'unknown'}
          topography={metadata.topography || 'none'}
          rainfall={metadata.rainfall || 'medium'}
          footingCount={metadata.footingCount || 1}
        />
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
        <button
          onClick={loadDemoProject}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Load Demo Project
        </button>
      </div>

      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}