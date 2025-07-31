// File: pages/dashboard.tsx
import Sidebar from '../components/Sidebar';

export default function DashboardPage() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1>Brand Concept and Design</h1>
        <h2>Research, ideate and present brand concepts</h2>

        <div className="tab-bar">
          <div className="tab active">Tasks</div>
          <div className="tab">Files</div>
          <div className="tab">Activity</div>
        </div>

        <div className="card">
          <strong>Client Objective Meeting</strong>
          <p className="muted">Today</p>
          <div className="avatar-group">
            <img src="/assets/avatar1.jpg" alt="A" />
            <img src="/assets/avatar2.jpg" alt="B" />
          </div>
        </div>

        <div className="card">
          <strong>Target market trend analysis</strong>
          <p className="muted">Due in 5 days</p>
        </div>

      </div>
    </div>
  );
}
