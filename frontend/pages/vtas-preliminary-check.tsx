import React from 'react';

const VTASPreliminaryPlanningCheck: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white text-black">
      <h1 className="text-3xl font-bold mb-2">VTAS Preliminary Planning Check</h1>
      <p className="text-sm mb-6">11 Osborn Court</p>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Summary of Findings</h2>
        <p>
          This report outlines the preliminary findings for the planning assessment conducted for 11 Osborn Court. The aim of this check is to assist with initial development feasibility in accordance with local planning regulations.
        </p>

        <h3 className="text-xl font-semibold mt-6">Zoning and Overlays</h3>
        <ul className="list-disc pl-6">
          <li>Zone: General Residential Zone (GRZ1)</li>
          <li>Overlays: Significant Landscape Overlay (SLO), Bushfire Management Overlay (BMO)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">Permit Requirements</h3>
        <ul className="list-disc pl-6">
          <li>Construction of a dwelling may require a planning permit under the BMO.</li>
          <li>Tree removal within the SLO area is subject to additional controls.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">Bushfire Management</h3>
        <p>
          Bushfire Attack Level (BAL) assessment should be undertaken. Defendable space and construction requirements must comply with CFA guidelines.
        </p>

        <h3 className="text-xl font-semibold mt-6">Services</h3>
        <ul className="list-disc pl-6">
          <li>Water, sewerage, and electricity services are assumed available but should be confirmed with the responsible authority.</li>
          <li>Stormwater drainage solutions may be required as part of any future development application.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">Conclusion</h3>
        <p>
          Further detailed investigation is required for any formal application. This preliminary check should not be relied upon in lieu of formal planning advice. Contact your planning consultant or council for application requirements.
        </p>
      </div>
    </div>
  );
};

export default VTASPreliminaryPlanningCheck;
