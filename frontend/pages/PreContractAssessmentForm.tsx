import { useState } from 'react';
import NewAddressAutocomplete from '@/components/newAddressAutocomplete';
import supabase from '@/lib/supabaseClient';
import FootingRiskDisplay from '@/components/FootingRiskDisplay';
import { fetchNearestWindZone } from '@/utils/fetchWindZone';

interface AddressMetadata {
  address: string;
  lat: number;
  lng: number;
  postcode?: string;
  suburb?: string;
  state?: string;
  country?: string;
}

interface FormData {
  projectName: string;
  firstName: string;
  lastName: string;
  address: string;
  lat: number;
  lng: number;
  suburb: string;
  postcode: string;
  state: string;
  country: string;
  council: string;
  elevation: string;
  distanceToCoast: string;
  windZone: string;
  balRating: string;
  benchmark1: string;
  benchmark2: string;
  footingRecommendation: string;
  riskSummary: string;
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddressSelect = async (meta: AddressMetadata) => {
    setLoading(true);
    setError(null);

    const { address, lat, lng, postcode = '', suburb = '', state = '', country = '' } = meta;

    try {
      const [councilRes, elevRes, distRes, windRes, benchmarks] = await Promise.all([
        fetchCouncilName(postcode),
        fetchElevation(lat, lng),
        fetchDistanceToCoast(lat, lng),
        fetchNearestWindZone(lat, lng),
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
        country,
        council: councilRes || '',
        elevation: elevRes?.toString() || '',
        distanceToCoast: distRes?.toString() || '',
        windZone: windRes?.region || windRes?.area || '',
        benchmark1: benchmarks?.benchmark1?.toString() || '',
        benchmark2: benchmarks?.benchmark2?.toString() || '',
      }));

      sessionStorage.setItem('latestProject', JSON.stringify({
        ...formData,
        address,
        suburb,
        state,
        postcode,
      }));
    } catch (err) {
      console.error('Error in handleAddressSelect:', err);
      setError('Failed to fetch site data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCouncilName = async (postcode: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('councils_by_postcode')
      .select('lga_region')
      .eq('postcode', postcode)
      .maybeSingle();

    if (error) {
      console.error('Supabase council lookup error:', error.message);
      return null;
    }
    return data?.lga_region ?? null;
  };

  const fetchElevation = async (lat: number, lng: number): Promise<number | null> => {
    try {
      const res = await fetch('/api/elevation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
      });
      const json = await res.json();
      return res.ok ? json.elevation ?? null : null;
    } catch (err) {
      console.error('Elevation fetch failed:', err);
      return null;
    }
  };

  const fetchDistanceToCoast = async (lat: number, lng: number): Promise<number | null> => {
    try {
      const res = await fetch(`/api/proximity?lat=${lat}&lng=${lng}`);
      const json = await res.json();
      return res.ok ? json.distance ?? null : null;
    } catch (err) {
      console.error('Proximity fetch failed:', err);
      return null;
    }
  };

  const fetchBenchmarks = async (
    lat: number,
    lng: number
  ): Promise<{ benchmark1: number | null; benchmark2: number | null }> => {
    try {
      const { data, error } = await supabase.rpc('nearest_benchmarks', { lat, lng });
      const [b1, b2] = data || [];
      return {
        benchmark1: b1?.elevation ?? null,
        benchmark2: b2?.elevation ?? null,
      };
    } catch (err) {
      console.error('Benchmark fetch error:', err);
      return { benchmark1: null, benchmark2: null };
    }
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
    try {
      const res = await fetch('/api/store-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        window.location.href = '/report-preview';
      } else {
        setError('Failed to save project. Please try again.');
      }
    } catch (err) {
      console.error('Form submit error:', err);
      setError('Failed to save project. Please try again.');
    }
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

        {loading && <p>Loading site data...</p>}
        {error && <p className="error">{error}</p>}

        <div className="card">
          <h2 className="card-title">Project Info</h2>
          <div className="form-grid">
            {['projectName', 'firstName', 'lastName'].map((key) => (
              <div key={key}>
                <label>{key.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type="text"
                  value={formData[key as keyof FormData] as string}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                  }
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
                <label>{key.replace(/([A-Z])/g, ' $1')}</label>
                <input value={formData[key as keyof FormData]} readOnly />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">BAL Rating</h2>
          <select
            value={formData.balRating}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, balRating: e.target.value }))
            }
          >
            <option value="">Select BAL Rating</option>
            {['BAL-LOW', 'BAL-12.5', 'BAL-19', 'BAL-29', 'BAL-40', 'BAL-FZ'].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="card">
          <h2 className="card-title">Site Metadata</h2>
          <div className="meta-grid">
            <p><strong>Council:</strong> {formData.council || 'Data not received from Supabase'}</p>
            <p><strong>Latitude:</strong> {formData.lat ? `${formData.lat}°` : 'No location selected yet'}</p>
            <p><strong>Longitude:</strong> {formData.lng ? `${formData.lng}°` : 'No location selected yet'}</p>
            <FootingRiskDisplay
              elevation={parseFloat(formData.elevation || '0')}
              distanceToCoast={parseFloat(formData.distanceToCoast || '0')}
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
            <p><strong>Elevation:</strong> {formData.elevation || 'Elevation not retrieved'}</p>
            <p><strong>Distance to Coast:</strong>
              {formData.distanceToCoast
                ? `${(parseFloat(formData.distanceToCoast) / 1000).toFixed(2)} km`
                : 'No coastal distance available'}
            </p>
            <p><strong>Wind Zone:</strong> {formData.windZone || 'Wind zone lookup failed'}</p>
            <p><strong>Benchmark 1:</strong> {formData.benchmark1 || 'No benchmark found nearby'}</p>
            <p><strong>Benchmark 2:</strong> {formData.benchmark2 || 'Second benchmark unavailable'}</p>
            <p><strong>Footing Recommendation:</strong> {formData.footingRecommendation || 'Risk analysis incomplete'}</p>
            <p><strong>Risk Summary:</strong> {formData.riskSummary || 'Risk category not yet calculated'}</p>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Requested Services</h2>
          <div className="checkbox-grid">
            {['Site Classification', 'Soil Test', 'Wind Rating', 'BAL Report', 'Flood Risk', 'Environmental Constraints'].map((service) => (
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
          <button className="primary-button" onClick={handleSubmit} disabled={loading}>
            Approve & Continue
          </button>
        </div>
      </main>
    </div>
  );
}
