import type { FishingZone, MarineConditions } from '@/types';

const BASE = 'https://marine-api.open-meteo.com/v1/marine';

interface OpenMeteoResponse {
  current: {
    time: string;
    wave_height: number;
    wave_period: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    ocean_current_velocity: number;
  };
  hourly: {
    time: string[];
    sea_surface_temperature: number[];
    visibility: number[];
  };
}

export async function fetchMarineConditions(zone: FishingZone): Promise<MarineConditions> {
  const params = new URLSearchParams({
    latitude: String(zone.lat),
    longitude: String(zone.lon),
    current: 'wave_height,wave_period,wind_speed_10m,wind_direction_10m,ocean_current_velocity',
    hourly: 'sea_surface_temperature,visibility',
    wind_speed_unit: 'kmh',
    timezone: 'UTC',
    forecast_days: '1',
  });

  const res = await fetch(`${BASE}?${params}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`OpenMeteo error ${res.status} for zone ${zone.id}`);

  const data: OpenMeteoResponse = await res.json();
  const { current, hourly } = data;

  // Use midday SST (closest to noon UTC = index 12)
  const sstIndex = Math.min(12, hourly.sea_surface_temperature.length - 1);
  const seaTempC = hourly.sea_surface_temperature[sstIndex] ?? current.wave_height;
  const visibilityKm = (hourly.visibility[sstIndex] ?? 10000) / 1000;

  return {
    zoneId: zone.id,
    fetchedAt: new Date().toISOString(),
    waveHeightM: Math.round(current.wave_height * 10) / 10,
    wavePeriodS: Math.round(current.wave_period),
    windSpeedKmh: Math.round(current.wind_speed_10m),
    windDirectionDeg: Math.round(current.wind_direction_10m),
    seaTempC: Math.round(seaTempC * 10) / 10,
    currentSpeedMs: Math.round(current.ocean_current_velocity * 100) / 100,
    visibilityKm: Math.round(visibilityKm * 10) / 10,
  };
}
