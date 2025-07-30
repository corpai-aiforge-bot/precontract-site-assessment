// pages/ui1.tsx

import React, { useState } from 'react';
import Head from 'next/head';
import AddressAutocomplete from '../components/addressAutocomplete';
import ProjectMetadataForm from '../components/ProjectMetadataForm';
import ServiceChecklist from '../components/ServiceChecklist';
import { submitForm } from '../utils/formSubmit';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  lat?: number;
  lng?: number;
  council?: string;
  region?: string;
  elevation?: number;
  distanceToCoast?: number;
  projectName: string;
  lotNumber: string;
  selectedServices: string[];
}

export default function UI1Page() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    projectName: '',
    lotNumber: '',
    selectedServices: [],
  });

  const handleAddressMetadata = (metadata: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...metadata,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (services: string[]) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: services,
    }));
  };

  const handleSubmit = async () => {
    await submitForm(formData);
  };

  return (
    <>
      <Head>
        <title>PreContract Site Assessment</title>
      </Head>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">📋 PreContract Site Assessment</h1>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="border rounded p-2 w-full"
          />
        </div>

        {/* Address Autocomplete */}
        <AddressAutocomplete onMetadata={handleAddressMetadata} />

        {/* Auto-Filled Metadata Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-6 text-sm text-gray-600">
          <div>Council: <strong>{formData.council || '—'}</strong></div>
          <div>Region: <strong>{formData.region || '—'}</strong></div>
          <div>Elevation: <strong>{formData.elevation ?? '—'} m</strong></div>
          <div>Distance to Coast: <strong>{formData.distanceToCoast ?? '—'} km</strong></div>
        </div>

        {/* Project Metadata */}
        <ProjectMetadataForm formData={formData} onChange={handleInputChange} />

        {/* Services Checklist */}
        <ServiceChecklist
          selectedServices={formData.selectedServices}
          onChange={handleServiceChange}
        />

        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </>
  );
}
