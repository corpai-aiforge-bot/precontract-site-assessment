import { useState } from 'react';
import AddressAutocomplete from '@/components/addressAutocomplete';
import supabase from '@/lib/supabaseClient';
import '@/styles/ui1.scss'; // import SCSS

interface AddressMetadata {
  address: string;
  lat: number;
  lng: number;
  postcode?: string;
  suburb?: string;
  state?: string;
  country?: string;
  council?: string;
  elevation?: number;
  distanceToCoast?: number;
  windZone?: string;
  balRating?: string;
  benchmark1?: number;
  benchmark2?: number;
  footingRecommendation?: string;
  riskSummary?: string;
}

export default function PreContractAssessmentForm() {
  const [formData, setFormData] = useState({
    projectName: '',
    firstName: '',
    lastName: '',
    street: '',
    suburb: '',
    postcode: '',
    state: '',
    council: '',
    elevation: '',
    distanceToCoast: '',
    windZone: '',
    balRating: '',
    benchmark1: '',
    benchmark2: '',
    footingRecommendation: '',
    riskSummary: '',
    services: [] as string[],
  });

  async function fetchCouncilName(postcode: string) {
    const { data, error } = await supabase
      .from('councils_by_postcode')
      .select('lga_region')
      .eq('postcode', postcode)
      .single();
    return error ? null : data?.lga_region;
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
    const res = await fetch('/api/windzone', {
      method: 'POST',
      body: JSON.stringify({ lat, lng }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    return json?.windZone ?? null;
  }

  async function fetchBenchmarks(suburb: string, postcode: string) {
    const res = await fetch('/api/benchmarks', {
      method: 'POST',
      body: JSON.stringify({ suburb, postcode }),
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    return { benchmark1: json?.benchmark1, benchmark2: json?.benchmark2 };
  }

  const handleAddressSelect = async (meta: AddressMetadata) => {
    const { address, lat, lng, postcode = '', suburb = '', state = '' } = meta;
    const [council, elevation, distanceToCoast, windZone, benchmarks] = await Promise.all([
      fetchCouncilName(postcode),
      fetchElevation(lat, lng),
      fetchDistanceToCoast(lat, lng),
      fetchWindZone(lat, lng),
      fetchBenchmarks(suburb, postcode),
    ]);

    setFormData((prev) => ({
      ...prev,
      street: address,
      suburb,
      state,
      postcode,
      council: council || '',
      elevation: elevation?.toString() || '',
      distanceToCoast: distanceToCoast?.toString() || '',
      windZone: windZone || '',
      benchmark1: benchmarks.benchmark1?.toString() || '',
      benchmark2: benchmarks.benchmark2?.toString() || '',
    }));

    sessionStorage.setItem(
      'latestProject',
      JSON.stringify({ ...formData, street: address, suburb, state, postcode })
    );
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
          <AddressAutocomplete onSelect={handleAddressSelect} />
          <div className="form-grid">
            {['street', 'suburb', 'state', 'postcode'].map((key) => (
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
            <p><strong>Elevation:</strong> {formData.elevation || '—'} m</p>
            <p><strong>Distance to Coast:</strong> {formData.distanceToCoast || '—'} km</p>
            <p><strong>Wind Zone:</strong> {formData.windZone || '—'}</p>
            <p><strong>Benchmarks:</strong> {formData.benchmark1 || '—'}, {formData.benchmark2 || '—'}</p>
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
