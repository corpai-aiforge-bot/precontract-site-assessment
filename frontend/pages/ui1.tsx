import { useState } from "react";
import AddressAutocomplete from "@/components/addressAutocomplete";
import { supabase } from "@/utils/supabaseClient";

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
    projectName: "",
    firstName: "",
    lastName: "",
    street: "",
    suburb: "",
    postcode: "",
    state: "",
    council: "",
    elevation: "",
    distanceToCoast: "",
    windZone: "",
    balRating: "",
    benchmark1: "",
    benchmark2: "",
    footingRecommendation: "",
    riskSummary: "",
    services: [] as string[],
  });

  async function fetchCouncilName(postcode: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("councils_by_postcode")
      .select("lga_region")
      .eq("postcode", postcode)
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching council:", error);
      return null;
    }

    return data?.lga_region || null;
  }

  async function fetchElevation(lat: number, lng: number): Promise<number | null> {
    const res = await fetch("/api/elevation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng }),
    });
    if (!res.ok) return null;
    const { elevation } = await res.json();
    return elevation;
  }

  async function fetchDistanceToCoast(lat: number, lng: number): Promise<number | null> {
    const res = await fetch("/api/proximity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng }),
    });
    if (!res.ok) return null;
    const { distanceToCoast } = await res.json();
    return distanceToCoast;
  }

  async function fetchWindZone(lat: number, lng: number): Promise<string | null> {
    const res = await fetch("/api/windzone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lat, lng }),
    });
    if (!res.ok) return null;
    const { windZone } = await res.json();
    return windZone;
  }

  async function fetchBenchmarks(suburb: string, postcode: string): Promise<{ benchmark1: number | null; benchmark2: number | null }> {
    const res = await fetch("/api/benchmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suburb, postcode }),
    });
    if (!res.ok) return { benchmark1: null, benchmark2: null };
    return await res.json();
  }

  const handleAddressSelect = async (meta: AddressMetadata) => {
    const { address, lat, lng, postcode = "", suburb = "", state = "" } = meta;

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
      council: council || "",
      elevation: elevation?.toString() || "",
      distanceToCoast: distanceToCoast?.toString() || "",
      windZone: windZone || "",
      benchmark1: benchmarks.benchmark1?.toString() || "",
      benchmark2: benchmarks.benchmark2?.toString() || "",
      balRating: "",
      footingRecommendation: "",
      riskSummary: "",
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
    const res = await fetch("/api/store-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) window.location.href = "/report-preview";
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg border border-gray-200 rounded-2xl space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">🏗️ PreContract Site Assessment</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Project Name", key: "projectName" },
          { label: "First Name", key: "firstName" },
          { label: "Last Name", key: "lastName" },
        ].map(({ label, key }) => (
          <div key={key} className="space-y-1">
            <label className="text-sm text-gray-600 font-medium">{label}</label>
            <input
              type="text"
              value={formData[key as keyof typeof formData] as string}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className="w-full p-2 border rounded shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <label className="text-sm text-gray-600 font-medium">Site Address</label>
        <AddressAutocomplete onSelect={handleAddressSelect} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {["street", "suburb", "state", "postcode"].map((key) => (
          <div key={key} className="space-y-1">
            <label className="text-sm text-gray-600 font-medium capitalize">{key}</label>
            <input
              value={formData[key as keyof typeof formData]}
              readOnly
              disabled
              className="w-full p-2 border rounded bg-gray-50 text-gray-700"
            />
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <label className="text-sm text-gray-600 font-medium">BAL Rating</label>
        <select
          value={formData.balRating}
          onChange={(e) => setFormData({ ...formData, balRating: e.target.value })}
          className="w-full p-2 border rounded focus:ring focus:ring-blue-200"
        >
          <option value="">Select BAL Rating</option>
          {["BAL-LOW", "BAL-12.5", "BAL-19", "BAL-29", "BAL-40", "BAL-FZ"].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm text-gray-800 space-y-1">
        <p>
          <strong>Council:</strong> {formData.council || "—"}
        </p>
        <p>
          <strong>Elevation:</strong> {formData.elevation || "—"} m
        </p>
        <p>
          <strong>Distance to Coast:</strong> {formData.distanceToCoast || "—"} km
        </p>
        <p>
          <strong>Wind Zone:</strong> {formData.windZone || "—"}
        </p>
        <p>
          <strong>BAL Rating:</strong> {formData.balRating || "—"}
        </p>
        <p>
          <strong>Benchmarks:</strong> {formData.benchmark1 || "—"}, {formData.benchmark2 || "—"}
        </p>
        <p>
          <strong>Footing Recommendation:</strong> {formData.footingRecommendation || "—"}
        </p>
        <p>
          <strong>Risk Summary:</strong> {formData.riskSummary || "—"}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800">Services Requested</h2>
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          {["Site Classification", "Soil Test", "Wind Rating", "BAL Report", "Flood Risk", "Environmental Constraints"].map((service) => (
            <label key={service} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.services.includes(service)}
                onChange={() => handleServiceToggle(service)}
                className="accent-blue-600"
              />
              {service}
            </label>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
        >
          Approve & Continue
        </button>
      </div>
    </div>
  );
}
