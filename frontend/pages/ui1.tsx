import { useState } from 'react';
import NewAddressAutocomplete from '@/components/newAddressAutocomplete';
import supabase from '@/lib/supabaseClient';
import FootingRiskDisplay from '@/components/FootingRiskDisplay';

interface AddressMetadata {
  address: string;
  lat: number;
  lng: number;
  postcode?: string;
  suburb?: string;
  state?: string;
  country?: string;
  council?: string;
  elevation?: number | string;
  distanceToCoast?: number | string;
  windZone?: string;
  balRating?: string;
  benchmark1?: number | string;
  benchmark2?: number | string;
  footingRecommendation?: string;
  riskSummary?: string;
}

interface FormData extends AddressMetadata {
  projectName: string;
  firstName: string;
  lastName: string;
  services: string[];
}

export default function PreContractAssessmentForm() {
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    firstName: '',
    lastName: '',
    address: '',
    lat: 0,
    lng: 0,
    suburb: '',
    postcode: '',
    state: '',
    country: '',
    council: '',
    elevation: '',
    distanceToCoast: '',
    windZone: '',
    balRating: '',
    benchmark1: '',
    benchmark2: '',
    footingRecommendation: '',
    riskSummary: '',
    services: [],
  });

  const handleAddressSelect = async (meta: AddressMetadata) => {
    const { address, lat, lng, postcode = '', suburb = '', state = '' } = meta;

    const [council, elevation, distanceToCoast, windZone, benchmarks] = await Promise.all([
      fetchCouncilName(postcode),
      fetchElevation(lat, lng),
      fetchDistanceToCoast(lat, lng),
      fetchWindZone(lat, lng),
      fetchBenchmarks(lat, lng),
    ]);

    setFormData((prev) => ({
      ...prev,
      address,
      lat,
      lng,
      suburb,
      state,
      postcode,
      council: council || '',
      elevation: elevation?.toString() || '',
      distanceToCoast: distanceToCoast?.toString() || '',
      windZone: windZone || '',
      benchmark1: benchmarks?.benchmark1?.toString() || '',
      benchmark2: benchmarks?.benchmark2?.toString() || '',
      balRating: '',
      footingRecommendation: '',
      riskSummary: '',
    }));

    sessionStorage.setItem('latestProject', JSON.stringify({
      ...formData,
      address,
      suburb,
      state,
      postcode,
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/store-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) window.location.href = '/report-preview';
  };

  return (
    <div className="page">
      <aside className="sidebar">
        <h2 className="logo">🏗️ Site Assessment</h2>
        <nav className="nav">
          <a className="nav-link active">Project</a>
          <a className="nav-link">Reports</a>
        </nav>
      </aside>

      <main className="main-content">
        <h1 className="section-header">PreContract Site Assessment</h1>

        <div className="card">
          <h2 className="card-title">Project Info</h2>
          <div className="form-grid">
            {['projectName', 'firstName', 'lastName'].map((key) => (
              <div key={key}>
                <label>{key}</label>
                <input
                  type="text"
                  value={formData[key as keyof typeof formData] as string}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Site Address</h2>
          <NewAddressAutocomplete onSelect={handleAddressSelect} />
          <div className="form-grid">
            {['address', 'suburb', 'state', 'postcode'].map((key) => (
              <div key={key}>
                <label>{key}</label>
                <input value={formData[key as keyof typeof formData]} readOnly />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">BAL Rating</h2>
          <select
            value={formData.balRating}
            onChange={(e) => setFormData({ ...formData, balRating: e.target.value })}
          >
            <option value="">Select BAL Rating</option>
            {['BAL-LOW', 'BAL-12.5', 'BAL-19', 'BAL-29', 'BAL-40', 'BAL-FZ'].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="card">
          <h2 className="card-title">Site Metadata</h2>
          <div className="meta-grid">
            <p><strong>Council:</strong> {formData.council || '—'}</p>
            <p><strong>Latitude:</strong> {formData.lat || '—'}°</p>
            <p><strong>Longitude:</strong> {formData.lng || '—'}°</p>
            <FootingRiskDisplay
              elevation={parseFloat(String(formData.elevation || '0'))}
              distanceToCoast={parseFloat(String(formData.distanceToCoast || '0'))}
              onRiskUpdate={({ score, category }) =>
                setFormData((prev) => ({
                  ...prev,
                  riskSummary: `${category} site risk (score: ${score}/100)`,
                  footingRecommendation:
                    category === 'High'
                      ? 'Stumps or deep piers recommended'
                      : category === 'Medium'
                      ? 'Assess soil conditions for slab vs stump suitability'
                      : 'Slab-on-ground likely suitable',
                }))
              }
            />
            <p><strong>Elevation:</strong> {formData.elevation || '—'} m</p>
            <p><strong>Distance to Coast:</strong> {formData.distanceToCoast || '—'} km</p>
            <p><strong>Wind Zone:</strong> {formData.windZone || '—'}</p>
            <p><strong>Benchmark 1:</strong> {formData.benchmark1 || '—'} m AHD</p>
            <p><strong>Benchmark 2:</strong> {formData.benchmark2 || '—'} m AHD</p>
            <p><strong>Footing Recommendation:</strong> {formData.footingRecommendation || '—'}</p>
            <p><strong>Risk Summary:</strong> {formData.riskSummary || '—'}</p>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Requested Services</h2>
          <div className="checkbox-grid">
            {['Site Classification', 'Soil Test', 'Wind Rating', 'BAL Report', 'Flood Risk', 'Environmental Constraints'].map(service => (
              <label key={service}>
                <input
                  type="checkbox"
                  checked={formData.services.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                />
                {service}
              </label>
            ))}
          </div>
        </div>

        <div className="form-footer">
          <button className="primary-button" onClick={handleSubmit}>Approve & Continue</button>
        </div>
      </main>
    </div>
  );
}

async function fetchCouncilName(postcode: string): Promise<string | null> {
  try {
    const { data, error, status } = await supabase
      .from('councils_by_postcode')
      .select('lga_region')
      .eq('postcode', postcode)
      .maybeSingle();

    if (error) {
      console.error(`Supabase error [${status}]:`, error.message);
      return null;
    }

    return data?.lga_region || null;
  } catch (err) {
    console.error('Unexpected error fetching council name:', err);
    return null;
  }
}

async function fetchElevation(lat: number, lng: number) {
  const res = await fetch('/api/elevation', {
    method: 'POST',
    body: JSON.stringify({ lat, lng }),
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  return json?.elevation ?? null;
}

async function fetchDistanceToCoast(lat: number, lng: number) {
  const res = await fetch('/api/proximity', {
    method: 'POST',
    body: JSON.stringify({ lat, lng }),
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  return json?.distanceToCoast ?? null;
}

async function fetchWindZone(lat: number, lng: number) {
  const res = await fetch('/api/windzones', {
    method: 'POST',
    body: JSON.stringify({ lat, lng }),
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  return json?.windZone ?? null;
}

async function fetchBenchmarks(lat: number, lng: number): Promise<{ benchmark1: number | null; benchmark2: number | null }> {
  const res = await fetch('/api/benchmarks', {
    method: 'POST',
    body: JSON.stringify({ lat, lng }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) return { benchmark1: null, benchmark2: null };
  return await res.json();
}
