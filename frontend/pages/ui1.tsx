import { useState } from 'react';
import ProjectMetadataForm from '../components/ProjectMetadataForm';
import ServiceChecklist from '../components/ServiceChecklist';
import AddressAutocomplete from '../components/addressAutocomplete';
import AdvancedFootingAssessor from '../components/AdvancedFootingAssessor';
import { submitForm } from '../utils/formSubmit';
import Layout from '../components/Layout';

export default function UI1Page() {
  const [metadata, setMetadata] = useState<any>({
    project_name: '',
    lot_number: '',
    council: '',
    address: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  const [services, setServices] = useState<string[]>([]);
  const [riskScore, setRiskScore] = useState(82);
  const [riskCategory, setRiskCategory] = useState('LOW RISK – Steel Recommended');
  const [elevation, setElevation] = useState(12.3);
  const [coastalDistance, setCoastalDistance] = useState(2.7);
  const [status, setStatus] = useState('');
  const [submittedProjectId, setSubmittedProjectId] = useState<string | null>(null);

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
    if (result.success && result.projectId) {
      setSubmittedProjectId(result.projectId);
      setStatus('Submitted successfully!');
    } else {
      setStatus(`Error: ${result.error}`);
    }
  };

  const loadDemoProject = () => {
    setSubmittedProjectId(null);
    setMetadata({
      first_name: 'Alicia',
      last_name: 'Brown-Test',
      email: 'mcmdennis@gmail.com',
      phone: '+61400111222',
      project_name: 'Demo SDA Site - Magnetic Island',
      lot_number: '31',
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
    setServices(['Soil Testing', 'Contour & Feature Survey', 'BAL Assessment']);
    setRiskScore(82);
    setRiskCategory('LOW RISK – Steel Recommended');
    setElevation(12.3);
    setCoastalDistance(2.7);
    setStatus('Demo project loaded');
  };

  const handleEdit = () => {
    setSubmittedProjectId(null);
    setStatus('');
  };

  return (
    <Layout title="UI1 – Site Assessment Form">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">📋 PreContract Site Assessment</h1>

        {/* After submission: show PDF preview */}
        {submittedProjectId ? (
          <div className="space-y-4">
            <p className="text-green-600 text-sm">{status}</p>
            <iframe
              src={`/api/report-pdf?id=${submittedProjectId}`}
              title="PDF Preview"
              className="w-full h-[700px] border rounded shadow"
            />
            <button
              onClick={handleEdit}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              ← Back to Edit
            </button>
          </div>
        ) : (
          <>
            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name"
                className="input"
                value={metadata.first_name || ''}
                onChange={(e) => setMetadata((prev: any) => ({ ...prev, first_name: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="input"
                value={metadata.last_name || ''}
                onChange={(e) => setMetadata((prev: any) => ({ ...prev, last_name: e.target.value }))}
              />
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={metadata.email || ''}
                onChange={(e) => setMetadata((prev: any) => ({ ...prev, email: e.target.value }))}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="input"
                value={metadata.phone || ''}
                onChange={(e) => setMetadata((prev: any) => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            {/* Address Autocomplete */}
            <AddressAutocomplete
              onSelect={({ address, lat, lng }) =>
                setMetadata((prev: any) => ({ ...prev, address, lat, lng }))
              }
            />

            {/* Metadata & Services */}
            <ProjectMetadataForm metadata={metadata} setMetadata={setMetadata} />
            <ServiceChecklist selectedServices={services} setSelectedServices={setServices} />

            {/* Risk Estimator */}
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

            {/* Actions */}
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

            {/* Status */}
            {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
          </>
        )}
      </div>
    </Layout>
  );
}
