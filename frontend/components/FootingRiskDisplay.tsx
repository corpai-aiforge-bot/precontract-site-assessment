import React, { useEffect, useState } from 'react';

interface Props {
  elevation: number;
  distanceToCoast: number;
  onRiskUpdate?: (info: { score: number; category: string }) => void;
}

function computeRiskScore(elevation: number, distance: number): number {
  let score = 0;

  if (elevation < 10) score += 30;
  if (elevation >= 30) score -= 15;

  if (distance < 1) score += 30;
  if (distance > 5) score -= 15;

  return Math.min(100, Math.max(0, score));
}

function getCategory(score: number): string {
  if (score > 70) return 'High';
  if (score > 30) return 'Medium';
  return 'Low';
}

const FootingRiskDisplay: React.FC<Props> = ({ elevation, distanceToCoast, onRiskUpdate }) => {
  const [score, setScore] = useState<number>(0);
  const [category, setCategory] = useState<string>('Unknown');

  useEffect(() => {
    const computedScore = computeRiskScore(elevation, distanceToCoast);
    const computedCategory = getCategory(computedScore);

    setScore(computedScore);
    setCategory(computedCategory);

    if (onRiskUpdate) {
      onRiskUpdate({ score: computedScore, category: computedCategory });
    }
  }, [elevation, distanceToCoast]);

  return (
    <div className="mt-4 bg-gray-50 p-4 rounded border border-gray-300">
      <h3 className="text-lg font-semibold mb-2">🧱 Site Risk Assessment</h3>
      <p><strong>Elevation:</strong> {elevation.toFixed(1)} m</p>
      <p><strong>Distance to Coast:</strong> {distanceToCoast.toFixed(2)} km</p>
      <p className="mt-2">
        <strong>Risk Score:</strong> {score} / 100<br />
        <strong>Risk Category:</strong>{' '}
        <span className={
          category === 'High' ? 'text-red-600 font-bold' :
          category === 'Medium' ? 'text-yellow-600 font-semibold' :
          'text-green-600 font-semibold'
        }>
          {category}
        </span>
      </p>
    </div>
  );
};

export default FootingRiskDisplay;
