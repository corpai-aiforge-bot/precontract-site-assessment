// frontend/pages/report-preview.tsx
import { useEffect, useState } from 'react';

interface ProjectData {
  projectName: string;
  firstName: string;
  lastName: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
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

export default function ReportPreview() {
  const [project, setProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    fetch('/api/latest-project')
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(() => setProject(null));
  }, []);

  const downloadReport = async () => {
    const res = await fetch('/api/report-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'precontract-report.docx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!project) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 border border-gray-300 shadow-md bg-white rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Report Preview</h1>

      <section className="space-y-2 text-sm">
        <div><strong>Project Name:</strong> {project.projectName}</div>
        <div><strong>Name:</strong> {project.firstName} {project.lastName}</div>
        <div><strong>Address:</strong> {project.street}, {project.suburb} {project.state} {project.postcode}</div>
        <div><strong>Council:</strong> {project.council}</div>
        <div><strong>Elevation:</strong> {project.elevation} m</div>
        <div><strong>Distance to Coast:</strong> {project.distanceToCoast} km</div>
        <div><strong>Wind Zone:</strong> {project.windZone}</div>
        <div><strong>BAL Rating:</strong> {project.balRating}</div>
        <div><strong>Benchmark Levels:</strong> {project.benchmark1}, {project.benchmark2}</div>
        <div><strong>Footing Recommendation:</strong> {project.footingRecommendation}</div>
        <div><strong>Risk Summary:</strong> {project.riskSummary}</div>
        <div><strong>Services Requested:</strong> {project.services.join(', ')}</div>
      </section>

      <div className="mt-6 space-x-4">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={() => window.print()}
        >
          Print
        </button>
        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          onClick={downloadReport}
        >
          Download Report (.docx)
        </button>
      </div>
    </div>
  );
}
