export function computeRiskScore(elevation: number, distance: number): number {
  let score = 0;

  if (elevation < 10) score += 30;
  else if (elevation < 30) score += 10;
  else score -= 15;

  if (distance < 1) score += 30;
  else if (distance < 5) score += 10;
  else score -= 15;

  return Math.max(0, Math.min(score, 100)); // Clamp 0–100
}

export function getRiskCategory(score: number): 'High' | 'Medium' | 'Low' {
  if (score > 70) return 'High';
  if (score > 30) return 'Medium';
  return 'Low';
}
