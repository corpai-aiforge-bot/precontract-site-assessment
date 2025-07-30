// pages/report-preview.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import PDFRender from '../components/PDFRender';
import Layout from '../components/Layout';

interface Project {
  id: string;
  project_name: string;
  lot_number: string;
  council: string;
  address: string;
  lat: number;
  lng: number;
  notes?: string;
  services: string;
  submitted_at: string;
  risk_score?: number;
  risk_category?: string;
  elevation?: number;
  coastal_distance?: number;
}

export default function ReportPreview() {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchLatestProject() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('submitted_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) setProject(data[0]);
    }
    fetchLatestProject();
  }, []);

  if (!project) return <Layout><p>Loading latest report...</p></Layout>;

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">📄 Site Report Preview</h1>

        <section className="mb-4">
          <h2 className="font-semibold text-lg mb-1">Project Metadata</h2>
          <p><strong>Project:</strong> {project.project_name}</p>
          <p><strong>Lot:</strong> {project.lot_number}</p>
          <p><strong>Council:</strong> {project.council}</p>
          <p><strong>Address:</strong> {project.address}</p>
          <p><strong>Submitted:</strong> {new Date(project.submitted_at).toLocaleString()}</p>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold text-lg mb-1">Coordinates & Environmental</h2>
          <p><strong>Latitude:</strong> {project.lat}</p>
          <p><strong>Longitude:</strong> {project.lng}</p>
          <p><strong>Elevation:</strong> {project.elevation ?? 'N/A'} m</p>
          <p><strong>Distance to Coast:</strong> {project.coastal_distance ?? 'N/A'} km</p>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold text-lg mb-1">Services Requested</h2>
          <p>{project.services}</p>
        </section>

        <section className="mb-4">
          <h2 className="font-semibold text-lg mb-1">Risk & Recommendation</h2>
          <p><strong>Score:</strong> {project.risk_score ?? 'N/A'}/100</p>
          <p><strong>Category:</strong> {project.risk_category ?? 'N/A'}</p>
        </section>

        <section className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Printable PDF View</h2>
          <PDFRender src={`/api/report-pdf?id=${project.id}`} />
        </section>
      </div>
    </Layout>
  );
}
