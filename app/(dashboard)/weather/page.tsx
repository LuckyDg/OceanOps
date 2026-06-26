import { Topbar } from '@/components/layout/topbar';
import { FISHING_ZONES } from '@/lib/zones';
import { readFile } from 'fs/promises';
import path from 'path';
import type { DailyDataFile } from '@/types';
import { Wind, Eye, Waves, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';

export const revalidate = 3600;

async function getData(): Promise<DailyDataFile | null> {
  try {
    const raw = await readFile(path.join(process.cwd(), 'public', 'data', 'daily.json'), 'utf-8');
    return JSON.parse(raw);
  } catch { return null; }
}

const WIND_DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
function windDir(deg: number) { return WIND_DIRS[Math.round(deg / 45) % 8]; }

function beaufortDesc(kmh: number): { label: string; level: number } {
  if (kmh < 2)  return { label: 'Calma', level: 0 };
  if (kmh < 12) return { label: 'Brisa suave', level: 1 };
  if (kmh < 20) return { label: 'Brisa débil', level: 2 };
  if (kmh < 29) return { label: 'Brisa moderada', level: 3 };
  if (kmh < 39) return { label: 'Brisa fresca', level: 4 };
  if (kmh < 50) return { label: 'Brisa fuerte', level: 5 };
  if (kmh < 62) return { label: 'Viento fuerte', level: 6 };
  if (kmh < 75) return { label: 'Temporal', level: 7 };
  return { label: 'Temporal severo', level: 8 };
}

function visibilityDesc(km: number): string {
  if (km >= 20) return 'Excelente';
  if (km >= 10) return 'Buena';
  if (km >= 5)  return 'Moderada';
  if (km >= 2)  return 'Reducida';
  return 'Muy baja';
}

function waveAlert(m: number): { text: string; safe: boolean } {
  if (m <= 1.0) return { text: 'Condiciones seguras', safe: true };
  if (m <= 2.0) return { text: 'Navegación con precaución', safe: true };
  if (m <= 3.0) return { text: 'Solo embarcaciones grandes', safe: false };
  return { text: 'No recomendado navegar', safe: false };
}

// Compass SVG — arrow points toward wind direction
function WindCompass({ deg }: { deg: number }) {
  return (
    <div className="relative h-16 w-16 shrink-0">
      {/* Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-border" />
      {/* Cardinal labels */}
      <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[8px] text-muted font-mono">N</span>
      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] text-muted font-mono">S</span>
      <span className="absolute right-0.5 top-1/2 -translate-y-1/2 text-[8px] text-muted font-mono">E</span>
      <span className="absolute left-0.5 top-1/2 -translate-y-1/2 text-[8px] text-muted font-mono">O</span>
      {/* Arrow */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `rotate(${deg}deg)` }}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
          <path d="M12 4 L9 14 L12 12 L15 14 Z" fill="currentColor" className="text-accent" />
          <path d="M12 20 L9 14 L12 12 L15 14 Z" fill="currentColor" className="text-muted/30" />
        </svg>
      </div>
    </div>
  );
}

export default async function WeatherPage() {
  const data = await getData();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="flex flex-col min-h-full">
      <Topbar
        title="Tiempo Marino"
        subtitle={data?.date ? formatDate(data.date) : undefined}
      />

      <div className="flex-1 p-4 md:p-6">
        {data ? (
          <div className="space-y-4">

            {/* Alert summary row */}
            {(() => {
              const unsafe = data.conditions.filter((c) => c.waveHeightM > 2.0);
              return unsafe.length > 0 ? (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--fair)]/30 bg-[var(--fair-bg)] px-4 py-3">
                  <AlertTriangle className="h-4 w-4 text-[var(--fair)] shrink-0" />
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{unsafe.length} zona{unsafe.length > 1 ? 's' : ''}</span>
                    {' '}con condiciones adversas hoy — navegación con precaución.
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--excellent)]/30 bg-[var(--excellent-bg)] px-4 py-3">
                  <CheckCircle className="h-4 w-4 text-[var(--excellent)] shrink-0" />
                  <p className="text-sm text-foreground">Todas las zonas en condiciones favorables hoy.</p>
                </div>
              );
            })()}

            {/* Zone cards */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {FISHING_ZONES.map((zone) => {
                const cond = data.conditions.find((c) => c.zoneId === zone.id);
                if (!cond) return null;

                const bf = beaufortDesc(cond.windSpeedKmh);
                const vis = visibilityDesc(cond.visibilityKm);
                const alert = waveAlert(cond.waveHeightM);
                const mapsUrl = `https://www.google.com/maps?q=${zone.lat},${zone.lon}`;

                return (
                  <div
                    key={zone.id}
                    className="rounded-xl border border-border bg-surface p-5 hover:border-border-hi transition-colors"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-bold text-foreground">{zone.name}</h3>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-accent transition-colors mt-0.5"
                        >
                          <MapPin className="h-3 w-3" />
                          {zone.lat.toFixed(1)}°N, {Math.abs(zone.lon).toFixed(1)}°O
                        </a>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                          alert.safe
                            ? 'border-[var(--excellent)]/30 bg-[var(--excellent-bg)] text-[var(--excellent)]'
                            : 'border-[var(--fair)]/30 bg-[var(--fair-bg)] text-[var(--fair)]'
                        }`}
                      >
                        {alert.text}
                      </span>
                    </div>

                    {/* Wind section */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-surface-hover mb-4">
                      <WindCompass deg={cond.windDirectionDeg} />
                      <div className="flex-1">
                        <p className="text-[10px] text-muted uppercase tracking-wide mb-0.5">Viento</p>
                        <p className="text-2xl font-bold font-mono text-foreground leading-none">
                          {cond.windSpeedKmh}
                          <span className="text-sm font-normal text-muted ml-1">km/h</span>
                        </p>
                        <p className="text-xs text-muted mt-1">
                          {windDir(cond.windDirectionDeg)} · Beaufort {bf.level} — {bf.label}
                        </p>
                      </div>
                    </div>

                    {/* Olas y visibilidad */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-surface-hover p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Waves className="h-3.5 w-3.5 text-muted" />
                          <p className="text-[10px] text-muted uppercase tracking-wide">Oleaje</p>
                        </div>
                        <p className="text-lg font-bold font-mono text-foreground">
                          {cond.waveHeightM}
                          <span className="text-xs font-normal text-muted ml-1">m</span>
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">Período: {cond.wavePeriodS}s</p>
                      </div>

                      <div className="rounded-lg bg-surface-hover p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Eye className="h-3.5 w-3.5 text-muted" />
                          <p className="text-[10px] text-muted uppercase tracking-wide">Visibilidad</p>
                        </div>
                        <p className="text-lg font-bold font-mono text-foreground">
                          {cond.visibilityKm}
                          <span className="text-xs font-normal text-muted ml-1">km</span>
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">{vis}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Wind className="h-8 w-8 text-muted/30 mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Sin datos meteorológicos</p>
            <p className="text-xs text-muted">Ejecuta <code className="font-mono text-accent">pnpm fetch-data</code></p>
          </div>
        )}
      </div>
    </div>
  );
}
