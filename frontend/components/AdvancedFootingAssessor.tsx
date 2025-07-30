// components/AdvancedFootingAssessor.tsx
import { useEffect, useState } from 'react';
import { calculateDistanceToCoast } from '../utils/proximity';
import { getElevation } from '../utils/elevationFetch';

interface Props {
  lat: number;
  lon: number;
  resistivity: number;
  soilPH: number;
  wind: 'onshore' | 'offshore' | 'parallel' | 'unknown';
  topography: 'none' | 'partial' | 'significant' | 'valley';
  rainfall: 'low' | 'medium' | 'high';
  footingCount: number;
}

export default function AdvancedFootingAssessor({
  lat,
  lon,
  resistivity,
  soilPH,
  wind,
  topography,
  rainfall,
  footingCount,
}: Props) {
  const [distance, setDistance] = useState<number | null>(null);
  const [elevation, setElevation] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (lat && lon) {
      setDistance(calculateDistanceToCoast(lat, lon));
      getElevation(lat, lon).then(setElevation);
    }
  }, [lat, lon]);

  useEffect(() => {
    if (distance == null) return;

    let total = 0;

    // Soil Resistivity (35%)
    if (resistivity >= 5000) total += 35;
    else if (resistivity >= 3000) total += 25;
    else if (resistivity >= 1500) total += 15;
    else if (resistivity >= 500) total += 5;

    // Distance to Coast (30%)
    if (distance >= 15) total += 30;
    else if (distance >= 10) total += 20;
    else if (distance >= 7) total += 10;
    else if (distance >= 5) total += 5;

    // pH (15%)
    if (soilPH >= 6.5 && soilPH <= 8.5) total += 15;
    else if (soilPH >= 6.0 && soilPH <= 9.0) total += 10;
    else if (soilPH >= 5.5 && soilPH <= 9.5) total += 5;

    // Wind (10%)
    total += wind === 'offshore' ? 10 : wind === 'parallel' ? 7 : wind === 'onshore' ? 0 : 5;

    // Topography (5%)
    total += topography === 'significant' ? 5 : topography === 'partial' ? 3 : topography === 'valley' ? 0 : 1;

    // Rainfall (5%)
    total += rainfall === 'low' ? 5 : rainfall === 'medium' ? 3 : 0;

    setScore(total);

    if (total >= 80) setCategory('LOW RISK – Steel Recommended');
    else if (total >= 50) setCategory('MODERATE RISK – Enhanced or Concrete');
    else setCategory('HIGH RISK – Concrete Required');
  }, [distance, resistivity, soilPH, wind, topography, rainfall]);

  const cost = {
    standard: footingCount * 300,
    enhanced: footingCount * 400,
    concrete: footingCount * 440,
    premium: footingCount * 520,
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">🧠 Site Risk Assessment</h2>
      <p className="text-sm text-gray-600 mb-2">Risk Score: <strong>{score}/100</strong></p>
      <p className="mb-4 font-medium text-blue-700">Category: {category}</p>

      {distance !== null && (
        <p className="text-sm mb-1">📍 Distance to Coast: <strong>{distance} km</strong></p>
      )}
      {elevation !== null && (
        <p className="text-sm mb-3">📈 Elevation: <strong>{elevation} m</strong></p>
      )}

      <h3 className="text-md font-semibold mb-2">💰 Cost Estimates (AUD)</h3>
      <ul className="text-sm space-y-1">
        <li>Standard Steel: ${cost.standard.toLocaleString()}</li>
        <li>Enhanced Steel: ${cost.enhanced.toLocaleString()}</li>
        <li>Concrete + Steel: ${cost.concrete.toLocaleString()}</li>
        <li>Premium Concrete: ${cost.premium.toLocaleString()}</li>
      </ul>
    </div>
  );
}
