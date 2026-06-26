import { Topbar } from '@/components/layout/topbar';
import { FISHING_ZONES } from '@/lib/zones';
import { readFile } from 'fs/promises';
import path from 'path';
import type { DailyDataFile } from '@/types';
import { Zap, Star, TrendingUp, Clock, MapPin } from 'lucide-react';

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
const RATING_CLASS: Record<string, string> = {
  excellent: 'badge-excellent', good: 'badge-good', fair: 'badge-fair', poor: 'badge-poor',
};
const RATING_BORDER: Record<string, string> = {
  excellent: 'var(--excellent)', good: 'var(--good)', fair: 'var(--fair)', poor: 'var(--poor)',
};
const RATING_STARS: Record<string, number> = {
  excellent: 4, good: 3, fair: 2, poor: 1,
};

function Stars({ rating }: { rating: string }) {
  const n = RATING_STARS[rating] ?? 2;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= n ? 'text-[var(--fair)] fill-[var(--fair)]' : 'text-muted/30'}`}
        />
      ))}
    </div>
  );
}

export default async function ForecastPage() {
  const data = await getData();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const formatGenAt = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';

  return (
    <div className="flex flex-col min-h-full">
      <Topbar
        title="Pronóstico IA"
        subtitle={data?.date ? formatDate(data.date) : undefined}
      />

      <div className="flex-1 p-4 md:p-6">
        {data?.summary ? (
          <div className="space-y-6">

            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Zap className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Pronóstico diario de pesca</p>
                  <p className="text-xs text-muted">
                    Análisis de condiciones marinas actuales
                  </p>
                </div>
              </div>
              <div className="sm:ml-auto flex items-center gap-2 text-xs text-muted">
                <Clock className="h-3.5 w-3.5" />
                Generado a las {formatGenAt(data.summary.generatedAt)}
              </div>
            </div>

            {/* Zone forecast cards */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {data.summary.zones.map((z) => {
                const zone = FISHING_ZONES.find((fz) => fz.id === z.zoneId);
                const fish = data.fishing.find((f) => f.zoneId === z.zoneId);
                const rating = z.rating as keyof typeof RATING_BORDER;
                const mapsUrl = zone ? `https://www.google.com/maps?q=${zone.lat},${zone.lon}` : '#';

                return (
                  <div
                    key={z.zoneId}
                    className="rounded-xl border-l-4 border border-border bg-surface overflow-hidden hover:border-border-hi transition-colors"
                    style={{ borderLeftColor: RATING_BORDER[rating] }}
                  >
                    {/* Card header */}
                    <div className="px-5 pt-4 pb-3 border-b border-border">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-foreground truncate">{zone?.name ?? z.zoneId}</h3>
                          {zone && (
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-accent transition-colors mt-0.5"
                            >
                              <MapPin className="h-3 w-3" />
                              {zone.lat.toFixed(1)}°N, {Math.abs(zone.lon).toFixed(1)}°O
                            </a>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${RATING_CLASS[z.rating]}`}>
                            {RATING_ES[z.rating]}
                          </span>
                          <Stars rating={z.rating} />
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="px-5 py-4">
                      <p className="text-sm text-foreground leading-relaxed">{z.summary}</p>

                      {/* Key points */}
                      {z.keyPoints.length > 0 && (
                        <ul className="mt-3 space-y-2">
                          {z.keyPoints.map((kp, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted">
                              <TrendingUp className="h-3.5 w-3.5 text-accent/70 mt-0.5 shrink-0" />
                              <span>{kp}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Score bar */}
                      {fish && (
                        <div className="mt-4 pt-3 border-t border-border">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] text-muted uppercase tracking-wide">Puntuación de pesca</span>
                            <span className="text-sm font-bold font-mono text-foreground">
                              {fish.score}<span className="text-xs font-normal text-muted">/100</span>
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-surface-hi overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${fish.score}%`, backgroundColor: RATING_BORDER[rating] }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-muted/40 text-center">
              Este pronóstico es orientativo. Siempre consulta las autoridades marítimas locales antes de salir al mar.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
              <Zap className="h-6 w-6 text-accent" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">Pronóstico no disponible</p>
            <p className="text-xs text-muted mb-3">
              El resumen IA se genera con <code className="font-mono text-accent">GROQ_API_KEY</code> configurada
            </p>
            <p className="text-xs text-muted/60">
              Ejecuta <code className="font-mono text-accent">pnpm fetch-data</code> para generar el pronóstico del día
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
