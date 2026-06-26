import { Topbar } from '@/components/layout/topbar';
import { FISHING_ZONES } from '@/lib/zones';
import { readFile } from 'fs/promises';
import path from 'path';
import type { DailyDataFile, MarineConditions } from '@/types';
import { Waves, Wind, Thermometer, Eye, Navigation, MapPin } from 'lucide-react';

export const revalidate = 3600;

async function getData(): Promise<DailyDataFile | null> {
  try {
    const raw = await readFile(path.join(process.cwd(), 'public', 'data', 'daily.json'), 'utf-8');
    return JSON.parse(raw);
  } catch { return null; }
}

const RATING_ES: Record<string, string> = {
  excellent: 'Excelente', good: 'Bueno', fair: 'Regular', poor: 'Malo',
};
const RATING_BORDER: Record<string, string> = {
  excellent: 'var(--excellent)', good: 'var(--good)', fair: 'var(--fair)', poor: 'var(--poor)',
};
const RATING_CLASS: Record<string, string> = {
  excellent: 'badge-excellent', good: 'badge-good', fair: 'badge-fair', poor: 'badge-poor',
};

const WIND_DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
function windDir(deg: number) { return WIND_DIRS[Math.round(deg / 45) % 8]; }

function Metric({ icon: Icon, label, value, unit }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-muted/70 shrink-0" />
        <p className="text-[10px] text-muted uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-lg font-bold font-mono text-foreground leading-none">
        {value}
        {unit && <span className="text-xs font-sans font-normal text-muted ml-1">{unit}</span>}
      </p>
    </div>
  );
}

export default async function ConditionsPage() {
  const data = await getData();
  const condMap: Record<string, MarineConditions> = {};
  data?.conditions.forEach((c) => (condMap[c.zoneId] = c));

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="flex flex-col min-h-full">
      <Topbar
        title="Condiciones del Mar"
        subtitle={data?.date ? formatDate(data.date) : undefined}
      />
      <div className="flex-1 p-4 md:p-6">
        {data ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {FISHING_ZONES.map((zone) => {
              const cond = condMap[zone.id];
              const fish = data.fishing.find((f) => f.zoneId === zone.id);
              const rating = fish?.rating ?? 'fair';
              const mapsUrl = `https://www.google.com/maps?q=${zone.lat},${zone.lon}`;

              return (
                <div
                  key={zone.id}
                  className="rounded-xl border-l-4 border border-border bg-surface p-5 hover:border-border-hi transition-colors"
                  style={{ borderLeftColor: RATING_BORDER[rating] }}
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
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${RATING_CLASS[rating]}`}>
                      {RATING_ES[rating]}
                    </span>
                  </div>

                  {cond ? (
                    <>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        <Metric icon={Waves}       label="Altura de ola"  value={cond.waveHeightM}  unit="m" />
                        <Metric icon={Waves}       label="Período"         value={cond.wavePeriodS}  unit="s" />
                        <Metric icon={Wind}        label="Viento"          value={cond.windSpeedKmh} unit="km/h" />
                        <Metric icon={Navigation}  label="Dirección"       value={`${windDir(cond.windDirectionDeg)} (${cond.windDirectionDeg}°)`} />
                        <Metric icon={Thermometer} label="Temp. del mar"   value={cond.seaTempC}     unit="°C" />
                        <Metric icon={Eye}         label="Visibilidad"     value={cond.visibilityKm} unit="km" />
                      </div>

                      {fish && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-muted">Puntuación de pesca</span>
                            <span className="text-sm font-bold font-mono text-foreground">{fish.score}<span className="text-xs text-muted font-normal">/100</span></span>
                          </div>
                          <div className="h-2 rounded-full bg-surface-hi overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${fish.score}%`, backgroundColor: RATING_BORDER[rating] }}
                            />
                          </div>
                          <div className="grid grid-cols-4 gap-1 mt-2">
                            {[
                              { k: 'Olas', v: fish.factors.waves },
                              { k: 'Viento', v: fish.factors.wind },
                              { k: 'Marea', v: fish.factors.tide },
                              { k: 'Temp', v: fish.factors.temperature },
                            ].map(({ k, v }) => (
                              <div key={k} className="text-center rounded-md bg-surface-hover py-1.5">
                                <p className="text-[9px] text-muted">{k}</p>
                                <p className="text-xs font-bold font-mono text-foreground">{v}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-24 flex items-center justify-center rounded-lg bg-surface-hover">
                      <p className="text-xs text-muted">Sin datos disponibles</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Waves className="h-8 w-8 text-muted/30 mb-3" />
            <p className="text-sm text-muted">Sin datos · Ejecuta <code className="font-mono text-accent text-xs">pnpm fetch-data</code></p>
          </div>
        )}
      </div>
    </div>
  );
}
