import { Topbar } from '@/components/layout/topbar';
import { Waves, Wind, Thermometer, MapPin, Zap, ArrowUpRight } from 'lucide-react';
import type { DailyDataFile, FishingConditions, MarineConditions } from '@/types';
import { FISHING_ZONES } from '@/lib/zones';
import { readFile } from 'fs/promises';
import path from 'path';

export const revalidate = 3600;

async function getDailyData(): Promise<DailyDataFile | null> {
  try {
    const raw = await readFile(path.join(process.cwd(), 'public', 'data', 'daily.json'), 'utf-8');
    return JSON.parse(raw) as DailyDataFile;
  } catch { return null; }
}

const RATING_ES: Record<string, string> = {
  excellent: 'Excelente', good: 'Bueno', fair: 'Regular', poor: 'Malo',
};
const RATING_CLASS: Record<string, string> = {
  excellent: 'badge-excellent', good: 'badge-good', fair: 'badge-fair', poor: 'badge-poor',
};
const RATING_BORDER: Record<string, string> = {
  excellent: 'var(--excellent)', good: 'var(--good)', fair: 'var(--fair)', poor: 'var(--poor)',
};

const WIND_DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
function windDir(deg: number) { return WIND_DIRS[Math.round(deg / 45) % 8]; }

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function DashboardPage() {
  const data = await getDailyData();

  const condMap: Record<string, MarineConditions> = {};
  const fishMap: Record<string, FishingConditions> = {};
  data?.conditions.forEach((c) => (condMap[c.zoneId] = c));
  data?.fishing.forEach((f) => (fishMap[f.zoneId] = f));

  const avgWave = data
    ? (data.conditions.reduce((s, c) => s + c.waveHeightM, 0) / data.conditions.length).toFixed(1)
    : '—';
  const avgWind = data
    ? Math.round(data.conditions.reduce((s, c) => s + c.windSpeedKmh, 0) / data.conditions.length)
    : '—';
  const avgTemp = data
    ? (data.conditions.reduce((s, c) => s + c.seaTempC, 0) / data.conditions.length).toFixed(1)
    : '—';
  const bestZone = data ? data.fishing.reduce((b, f) => f.score > b.score ? f : b) : null;
  const bestZoneInfo = bestZone ? FISHING_ZONES.find((z) => z.id === bestZone.zoneId) : null;

  const kpis = [
    {
      label: 'Zonas monitoreadas',
      sub: 'activas',
      value: String(FISHING_ZONES.length),
      icon: MapPin,
      accent: 'text-accent',
      ring: 'bg-accent/10',
    },
    {
      label: 'Altura de ola prom.',
      sub: 'significativa',
      value: `${avgWave} m`,
      icon: Waves,
      accent: 'text-[var(--good)]',
      ring: 'bg-[var(--good-bg)]',
    },
    {
      label: 'Viento promedio',
      sub: 'a 10 m de altura',
      value: `${avgWind} km/h`,
      icon: Wind,
      accent: 'text-[var(--fair)]',
      ring: 'bg-[var(--fair-bg)]',
    },
    {
      label: 'Temperatura del mar',
      sub: 'superficie',
      value: `${avgTemp}°C`,
      icon: Thermometer,
      accent: 'text-[var(--poor)]',
      ring: 'bg-[var(--poor-bg)]',
    },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <Topbar
        title="Resumen"
        subtitle={data?.date ? formatDate(data.date) : undefined}
        updatedAt={data?.updatedAt ? `Actualizado ${new Date(data.updatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} UTC` : undefined}
      />

      <div className="flex-1 p-4 md:p-6 space-y-6">

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map(({ label, sub, value, icon: Icon, accent, ring }) => (
            <div
              key={label}
              className="rounded-xl border border-border bg-surface p-4 hover:border-border-hi hover:bg-surface-hover transition-all duration-150"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`h-8 w-8 rounded-lg ${ring} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${accent}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground font-mono tracking-tight mb-1">{value}</p>
              <p className="text-xs text-muted">{label}</p>
              <p className="text-[10px] text-muted/50">{sub}</p>
            </div>
          ))}
        </div>

        {/* Best zone banner */}
        {bestZone && bestZoneInfo && (
          <div
            className="rounded-xl border-l-4 border border-border bg-surface p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            style={{ borderLeftColor: RATING_BORDER[bestZone.rating] }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-1">
                Mejor zona para pescar hoy
              </p>
              <p className="text-xl font-bold text-foreground">{bestZoneInfo.name}</p>
              <p className="text-xs text-muted mt-0.5">
                {bestZoneInfo.lat.toFixed(1)}°N, {Math.abs(bestZoneInfo.lon).toFixed(1)}°O
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wide">Puntuación</p>
                <p className="text-3xl font-bold font-mono text-foreground">{bestZone.score}</p>
              </div>
              <span className={`text-sm font-bold px-3 py-1.5 rounded-full capitalize ${RATING_CLASS[bestZone.rating]}`}>
                {RATING_ES[bestZone.rating]}
              </span>
            </div>
          </div>
        )}

        {/* Zones grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Zonas de Pesca</h2>
            <span className="text-xs text-muted">{FISHING_ZONES.length} zonas</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {FISHING_ZONES.map((zone) => {
              const cond = condMap[zone.id];
              const fish = fishMap[zone.id];
              const rating = fish?.rating ?? 'fair';
              return (
                <div
                  key={zone.id}
                  className="rounded-xl border-l-4 border border-border bg-surface p-4 hover:border-border-hi hover:bg-surface-hover transition-all duration-150"
                  style={{ borderLeftColor: RATING_BORDER[rating] }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground leading-tight pr-2">{zone.name}</h3>
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${RATING_CLASS[rating]}`}>
                      {RATING_ES[rating]}
                    </span>
                  </div>

                  {cond ? (
                    <div className="space-y-1.5">
                      <Row label="Olas"    value={`${cond.waveHeightM}m / ${cond.wavePeriodS}s`} />
                      <Row label="Viento"  value={`${cond.windSpeedKmh} km/h ${windDir(cond.windDirectionDeg)}`} />
                      <Row label="Temp"    value={`${cond.seaTempC}°C`} />
                      {fish && (
                        <>
                          <div className="pt-2 border-t border-border" />
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-surface-hi overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${fish.score}%`,
                                  backgroundColor: RATING_BORDER[rating],
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-mono font-semibold text-foreground">{fish.score}</span>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted/60">Sin datos</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Summary */}
        {data?.summary && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-semibold text-foreground">Resumen IA del día</h2>
              </div>
              <span className="text-[10px] text-muted/50">hoy</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.summary.zones.map((z) => {
                const zone = FISHING_ZONES.find((fz) => fz.id === z.zoneId);
                const rating = z.rating as keyof typeof RATING_BORDER;
                return (
                  <div
                    key={z.zoneId}
                    className="rounded-xl border-l-4 border border-border bg-surface p-4"
                    style={{ borderLeftColor: RATING_BORDER[rating] }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground">{zone?.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${RATING_CLASS[z.rating]}`}>
                        {RATING_ES[z.rating]}
                      </span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-2">{z.summary}</p>
                    <ul className="space-y-1">
                      {z.keyPoints.slice(0, 2).map((kp) => (
                        <li key={kp} className="flex items-start gap-1.5 text-[11px] text-muted/70">
                          <ArrowUpRight className="h-3 w-3 text-accent/70 mt-px shrink-0" />
                          {kp}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-muted/40">
              Pronóstico basado en condiciones reales del día
            </p>
          </section>
        )}

        {!data && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Waves className="h-8 w-8 text-muted/30 mb-3" />
            <p className="text-sm font-medium text-muted">Sin datos disponibles</p>
            <p className="text-xs text-muted/60 mt-1">Ejecuta <code className="font-mono text-accent">pnpm fetch-data</code> para obtener datos</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-xs text-foreground font-mono font-medium">{value}</span>
    </div>
  );
}
