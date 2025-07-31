// frontend/pages/ui1.tsx

import { useState } from "react";
import AddressAutocomplete from "@/components/addressAutocomplete";
import { supabase } from "@/utils/supabaseClient";

interface AddressMetadata {
  address: string;
  lat: number;
  lng: number;
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

  async function fetchCouncilName(postcode: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('councils_by_postcode')
      .select('lga_region')
      .eq('postcode', postcode)
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching council:", error);
      return null;
    }

    return data?.lga_region || null;
  }

  async function fetchElevation(lat: number, lng: number): Promise<number | null> {
    const res = await fetch('/api/elevation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng }),
    });

    if (!res.ok) {
      console.error("Elevation fetch failed:", await res.text());
      return null;
    }

    const { elevation } = await res.json();
    return elevation;
  }

  async function fetchDistanceToCoast(lat: number, lng: number): Promise<number | null> {
    const res = await fetch('/api/proximity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng }),
    });

    if (!res.ok) {
      console.error("Distance to coast fetch failed:", await res.text());
      return null;
    }

    const { distanceToCoast } = await res.json();
    return distanceToCoast;
  }

  async function fetchWindZone(lat: number, lng: number): Promise<string | null> {
    const res = await fetch('/api/windzone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng }),
    });

    if (!res.ok) {
      console.error("Windzone fetch failed:", await res.text());
      return null;
    }

    const { windZone } = await res.json();
    return windZone;
  }

  async function fetchBenchmarks(suburb: string, postcode: string): Promise<{ benchmark1: number | null, benchmark2: number | null }> {
    const res = await fetch('/api/benchmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suburb, postcode }),
    });

    if (!res.ok) {
      console.error("Benchmark fetch failed:", await res.text());
      return { benchmark1: null, benchmark2: null };
    }

    return await res.json();
  }

  const handleAddressSelect = async (meta: AddressMetadata) => {
    const { address, lat, lng, postcode = '', suburb = '', state = '' } = meta;

    const [council, elevation, distanceToCoast, windZone, benchmarks] = await Promise.all([
      fetchCouncilName(postcode),
      fetchElevation(lat, lng),
      fetchDistanceToCoast(lat, lng),
      fetchWindZone(lat, lng),
      fetchBenchmarks(suburb, postcode)
    ]);

    setFormData(prev => ({
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
      balRating: '',
      footingRecommendation: '',
      riskSummary: ''
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
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
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl border border-gray-300 rounded-xl mt-8 space-y-6">
      <h1 className="text-2xl font-semibold">PreContract Site Assessment</h1>

      <div className="space-y-4">
        <input
          placeholder="Project Name"
          value={formData.projectName}
          onChange={e => setFormData({ ...formData, projectName: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <div className="grid grid-cols-1 gap-4">
          <input
            placeholder="First Name"
            value={formData.firstName}
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            placeholder="Last Name"
            value={formData.lastName}
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            className="p-2 border rounded"
          />
        </div>

        <AddressAutocomplete onSelect={handleAddressSelect} />

        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Street" value={formData.street} className="p-2 border rounded" readOnly />
          <input placeholder="Suburb/Town" value={formData.suburb} className="p-2 border rounded" readOnly />
          <input placeholder="State" value={formData.state} className="p-2 border rounded" readOnly />
          <input placeholder="Postcode" value={formData.postcode} className="p-2 border rounded" readOnly />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">BAL Rating</label>
        <select
          value={formData.balRating}
          onChange={e => setFormData({ ...formData, balRating: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select BAL Rating</option>
          <option value="BAL-LOW">BAL-LOW</option>
          <option value="BAL-12.5">BAL-12.5</option>
          <option value="BAL-19">BAL-19</option>
          <option value="BAL-29">BAL-29</option>
          <option value="BAL-40">BAL-40</option>
          <option value="BAL-FZ">BAL-FZ</option>
        </select>
      </div>


      <div className="space-y-2 text-sm text-gray-700">
        <div><strong>Council:</strong> {formData.council || '—'}</div>
        <div><strong>Elevation:</strong> {formData.elevation || '—'} m</div>
        <div><strong>Distance to Coast:</strong> {formData.distanceToCoast || '—'} km</div>
        <div><strong>Wind Zone:</strong> {formData.windZone || '—'}</div>
        <div><strong>BAL Rating:</strong> {formData.balRating || '—'}</div>
        <div><strong>Benchmarks:</strong> {formData.benchmark1 || '—'}, {formData.benchmark2 || '—'}</div>
        <div><strong>Footing Recommendation:</strong> {formData.footingRecommendation || '—'}</div>
        <div><strong>Risk Summary:</strong> {formData.riskSummary || '—'}</div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Services Requested</h2>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['Site Classification', 'Soil Test', 'Wind Rating', 'BAL Report', 'Flood Risk', 'Environmental Constraints'].map(s => (
            <label key={s} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.services.includes(s)}
                onChange={() => handleServiceToggle(s)}
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Approve & Continue
      </button>
    </div>
  );
}
