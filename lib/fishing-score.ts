import type { MarineConditions, FishingConditions, FishingRating } from '@/types';

function scoreWaves(waveM: number): number {
  if (waveM <= 0.5) return 100;
  if (waveM <= 1.0) return 90;
  if (waveM <= 1.5) return 80;
  if (waveM <= 2.0) return 65;
  if (waveM <= 2.5) return 45;
  if (waveM <= 3.0) return 30;
  return 10;
}

function scoreWind(kmh: number): number {
  if (kmh <= 10) return 100;
  if (kmh <= 20) return 88;
  if (kmh <= 30) return 70;
  if (kmh <= 40) return 50;
  if (kmh <= 50) return 30;
  return 10;
}

function scoreTemp(tempC: number): number {
  // Fish are most active in 15–28°C range
  if (tempC < 5)  return 20;
  if (tempC < 10) return 45;
  if (tempC < 15) return 70;
  if (tempC < 20) return 88;
  if (tempC <= 28) return 100;
  if (tempC <= 32) return 80;
  return 55;
}

function ratingFromScore(score: number): FishingRating {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

export function calculateFishingConditions(cond: MarineConditions): FishingConditions {
  const waves  = scoreWaves(cond.waveHeightM);
  const wind   = scoreWind(cond.windSpeedKmh);
  const temp   = scoreTemp(cond.seaTempC);
  // Tide gets a neutral 75 if no tide data provided
  const tide   = 75;

  const score = Math.round(waves * 0.35 + wind * 0.30 + tide * 0.15 + temp * 0.20);

  return {
    zoneId: cond.zoneId,
    rating: ratingFromScore(score),
    score,
    factors: { waves, wind, tide, temperature: temp },
  };
}
