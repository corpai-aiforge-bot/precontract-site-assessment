// frontend/pages/admin-dashboard.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  projectName: string;
  firstName: string;
  lastName: string;
  suburb: string;
  approval_status?: string;
  approved_services?: string[];
  created_at: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    fetch(`/api/all-projects?status=${filter}`)
      .then(res => res.json())
      .then(data => setProjects(data));
  }, [filter]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by status:</label>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as any)}
          className="border px-3 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Project</th>
            <th className="p-2 border">Client</th>
            <th className="p-2 border">Suburb</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Approved Services</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td className="border p-2">{p.projectName}</td>
              <td className="border p-2">{p.firstName} {p.lastName}</td>
              <td className="border p-2">{p.suburb}</td>
              <td className="border p-2">{p.approval_status || 'pending'}</td>
              <td className="border p-2">{(p.approved_services || []).join(', ')}</td>
              <td className="border p-2">
                <Link href={`/client-review?projectId=${p.id}`} className="text-blue-600 hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
