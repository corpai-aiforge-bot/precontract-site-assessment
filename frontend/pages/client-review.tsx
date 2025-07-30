// frontend/pages/client-review.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface ProjectData {
  id: string;
  projectName: string;
  firstName: string;
  lastName: string;
  suburb: string;
  services: string[];
  approved_services?: string[];
}

export default function ClientReview() {
  const router = useRouter();
  const { projectId } = router.query;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [approved, setApproved] = useState<string[]>([]);

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/latest-project?id=${projectId}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setApproved(data.approved_services || []);
      });
  }, [projectId]);

  const toggleService = (service: string) => {
    setApproved(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const submitApproval = async () => {
    const res = await fetch('/api/approve-services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId, approved_services: approved }),
    });
    if (res.ok) alert('Services approved. We’ll be in touch!');
    else alert('Error approving services.');
  };

  if (!project) return <div className="p-8">Loading project…</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 border border-gray-300 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold mb-2">Client Review – {project.projectName}</h1>
      <p className="mb-4 text-sm text-gray-600">Project for {project.firstName} {project.lastName}, {project.suburb}</p>

      <h2 className="text-lg font-semibold mb-3">Approve Services</h2>
      <ul className="space-y-2">
        {project.services.map(service => (
          <li key={service} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={approved.includes(service)}
              onChange={() => toggleService(service)}
              className="accent-blue-600"
            />
            <span>{service}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={submitApproval}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Approve Selected Services
      </button>
    </div>
  );
}
