// ─── Fishing Zones ────────────────────────────────────────────────────────────

export type FishingZoneId =
  | 'gulf-mexico'
  | 'pacific-northwest'
  | 'northeast-atlantic'
  | 'caribbean'
  | 'alaska';

export interface FishingZone {
  id: FishingZoneId;
  name: string;
  lat: number;
  lon: number;
  /** IANA timezone, e.g. "America/Chicago" */
  timezone: string;
}

// ─── Marine / Weather Conditions ──────────────────────────────────────────────

export interface MarineConditions {
  zoneId: FishingZoneId;
  fetchedAt: string; // ISO 8601
  /** Significant wave height in metres */
  waveHeightM: number;
  /** Peak wave period in seconds */
  wavePeriodS: number;
  /** Wind speed at 10 m (km/h) */
  windSpeedKmh: number;
  /** Wind direction in degrees (0 = N) */
  windDirectionDeg: number;
  /** Sea surface temperature °C */
  seaTempC: number;
  /** Ocean current speed m/s */
  currentSpeedMs: number;
  /** Visibility km — derived from weather model */
  visibilityKm: number;
}

// ─── Tidal Data ───────────────────────────────────────────────────────────────

export interface TidalEvent {
  time: string; // ISO 8601
  type: 'high' | 'low';
  heightM: number;
}

export interface TidalData {
  zoneId: FishingZoneId;
  stationId: string;
  stationName: string;
  fetchedAt: string;
  events: TidalEvent[];
}

// ─── Fishing Conditions Score ─────────────────────────────────────────────────

export type FishingRating = 'excellent' | 'good' | 'fair' | 'poor';

export interface FishingConditions {
  zoneId: FishingZoneId;
  rating: FishingRating;
  /** 0–100 composite score */
  score: number;
  factors: {
    waves: number;
    wind: number;
    tide: number;
    temperature: number;
  };
}

// ─── AI Daily Summary ─────────────────────────────────────────────────────────

export interface ZoneSummary {
  zoneId: FishingZoneId;
  summary: string;
  keyPoints: string[];
  rating: FishingRating;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  generatedAt: string; // ISO 8601
  model: string;
  zones: ZoneSummary[];
}

// ─── Static Data File Shape ───────────────────────────────────────────────────

/** Shape of public/data/daily.json */
export interface DailyDataFile {
  date: string;
  updatedAt: string;
  conditions: MarineConditions[];
  tides: TidalData[];
  fishing: FishingConditions[];
  summary: DailySummary | null;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export interface AppUIState {
  selectedZone: FishingZoneId | null;
  sidebarOpen: boolean;
}

