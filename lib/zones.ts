import type { FishingZone } from '@/types';

export const FISHING_ZONES: FishingZone[] = [
  {
    id: 'gulf-mexico',
    name: 'Gulf of Mexico',
    lat: 25.0,
    lon: -90.0,
    timezone: 'America/Chicago',
  },
  {
    id: 'pacific-northwest',
    name: 'Pacific Northwest',
    lat: 47.5,
    lon: -124.5,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'northeast-atlantic',
    name: 'NE Atlantic',
    lat: 42.0,
    lon: -70.0,
    timezone: 'America/New_York',
  },
  {
    id: 'caribbean',
    name: 'Caribbean Sea',
    lat: 15.0,
    lon: -75.0,
    timezone: 'America/Jamaica',
  },
  {
    id: 'alaska',
    name: 'Gulf of Alaska',
    lat: 57.0,
    lon: -153.0,
    timezone: 'America/Anchorage',
  },
];

export const ZONE_MAP = Object.fromEntries(
  FISHING_ZONES.map((z) => [z.id, z])
) as Record<string, FishingZone>;
