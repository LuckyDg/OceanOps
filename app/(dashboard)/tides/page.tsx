import { Topbar } from '@/components/layout/topbar';
import { FISHING_ZONES } from '@/lib/zones';
import { readFile } from 'fs/promises';
import path from 'path';
import type { DailyDataFile, TidalEvent } from '@/types';
import { MapPin, ArrowUp, ArrowDown, Clock } from 'lucide-react';

export const revalidate = 3600;

async function getData(): Promise<DailyDataFile | null> {
  try {
    const raw = await readFile(path.join(process.cwd(), 'public', 'data', 'daily.json'), 'utf-8');
    return JSON.parse(raw);
  } catch { return null; }
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  }) + ' UTC';
}

function nextEvent(events: TidalEvent[]): TidalEvent | null {
  const now = new Date();
  return events.find((e) => new Date(e.time) > now) ?? events[events.length - 1] ?? null;
}

function timeUntil(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return 'pasada';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `en ${h}h ${m}m`;
  return `en ${m}m`;
}

export default async function TidesPage() {
  const data = await getData();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="flex flex-col min-h-full">
      <Topbar
        title="Mareas"
        subtitle={data?.date ? formatDate(data.date) : undefined}
      />

      <div className="flex-1 p-4 md:p-6">
        {data?.tides && data.tides.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.tides.map((tideData) => {
              const zone = FISHING_ZONES.find((z) => z.id === tideData.zoneId);
              const next = nextEvent(tideData.events);
              const fish = data.fishing.find((f) => f.zoneId === tideData.zoneId);

              return (
                <div
                  key={tideData.zoneId}
                  className="rounded-xl border border-border bg-surface p-5 hover:border-border-hi transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-foreground">{zone?.name ?? tideData.zoneId}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <MapPin className="h-3 w-3 text-muted" />
                        <span className="text-[11px] text-muted">{tideData.stationName}</span>
                      </div>
                    </div>
                    {next && (
                      <div className="text-right">
                        <p className="text-[10px] text-muted uppercase tracking-wide">Próxima</p>
                        <p className="text-xs font-semibold text-accent">{timeUntil(next.time)}</p>
                      </div>
                    )}
                  </div>

                  {/* Próxima marea destacada */}
                  {next && (
                    <div
                      className={`rounded-lg p-3 mb-4 flex items-center gap-3 ${
                        next.type === 'high'
                          ? 'bg-[var(--good-bg)] border border-[var(--good)]/20'
                          : 'bg-surface-hover border border-border'
                      }`}
                    >
                      {next.type === 'high' ? (
                        <ArrowUp className="h-5 w-5 text-[var(--good)] shrink-0" />
                      ) : (
                        <ArrowDown className="h-5 w-5 text-muted shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-foreground">
                          {next.type === 'high' ? 'Marea Alta' : 'Marea Baja'}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-muted" />
                          <span className="text-[11px] text-muted">{formatTime(next.time)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold font-mono text-foreground">
                          {next.heightM.toFixed(2)}
                          <span className="text-xs font-normal text-muted ml-1">m</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Timeline de mareas */}
                  <div className="space-y-0">
                    {tideData.events.map((event, i) => {
                      const isHigh = event.type === 'high';
                      const isPast = new Date(event.time) < new Date();
                      return (
                        <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                          {/* indicador */}
                          <div className="flex flex-col items-center shrink-0 w-4">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                isHigh ? 'bg-[var(--good)]' : 'bg-muted'
                              } ${isPast ? 'opacity-30' : ''}`}
                            />
                            {i < tideData.events.length - 1 && (
                              <div className="w-px flex-1 min-h-[16px] bg-border" />
                            )}
                          </div>

                          <div className={`flex-1 flex items-center justify-between ${isPast ? 'opacity-40' : ''}`}>
                            <div className="flex items-center gap-2">
                              {isHigh ? (
                                <ArrowUp className="h-3.5 w-3.5 text-[var(--good)]" />
                              ) : (
                                <ArrowDown className="h-3.5 w-3.5 text-muted" />
                              )}
                              <span className="text-xs font-medium text-foreground">
                                {isHigh ? 'Alta' : 'Baja'}
                              </span>
                            </div>
                            <span className="text-xs text-muted">{formatTime(event.time)}</span>
                            <span className="text-sm font-bold font-mono text-foreground w-14 text-right">
                              {event.heightM.toFixed(2)} m
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {fish && (
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-[11px] text-muted">Factor marea en pesca</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-surface-hi overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${fish.factors.tide}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-semibold text-foreground">{fish.factors.tide}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
              <ArrowUp className="h-6 w-6 text-accent" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Sin datos de mareas</p>
            <p className="text-xs text-muted">Ejecuta <code className="font-mono text-accent">pnpm fetch-data</code> para obtener predicciones</p>
          </div>
        )}
      </div>
    </div>
  );
}
