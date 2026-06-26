import type { FishingZoneId, TidalData, TidalEvent } from '@/types';

const BASE = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';

// Only US zones have NOAA tide stations
const STATIONS: Partial<Record<FishingZoneId, { id: string; name: string }>> = {
  'gulf-mexico':       { id: '8771341', name: 'Galveston Bay, TX' },
  'pacific-northwest': { id: '9440910', name: 'Cape Disappointment, WA' },
  'northeast-atlantic': { id: '8443970', name: 'Boston, MA' },
  'alaska':            { id: '9454050', name: 'Kodiak, AK' },
};

interface NOAAPrediction {
  t: string; // "2024-01-15 06:23"
  v: string; // "1.234"
  type: 'H' | 'L';
}

interface NOAAResponse {
  predictions?: NOAAPrediction[];
  error?: { message: string };
}

export async function fetchTidalData(
  zoneId: FishingZoneId,
  date: Date = new Date()
): Promise<TidalData | null> {
  const station = STATIONS[zoneId];
  if (!station) return null;

  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');

  const params = new URLSearchParams({
    product: 'predictions',
    application: 'OceanOps',
    begin_date: dateStr,
    end_date: dateStr,
    datum: 'MLLW',
    station: station.id,
    time_zone: 'GMT',
    interval: 'hilo',
    units: 'metric',
    format: 'json',
  });

  const res = await fetch(`${BASE}?${params}`, { cache: 'no-store' });
  if (!res.ok) return null;

  const data: NOAAResponse = await res.json();
  if (data.error || !data.predictions) return null;

  const events: TidalEvent[] = data.predictions.map((p) => ({
    time: new Date(p.t + 'Z').toISOString(),
    type: p.type === 'H' ? 'high' : 'low',
    heightM: Math.round(parseFloat(p.v) * 100) / 100,
  }));

  return {
    zoneId,
    stationId: station.id,
    stationName: station.name,
    fetchedAt: new Date().toISOString(),
    events,
  };
}
