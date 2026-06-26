import { Topbar } from '@/components/layout/topbar';
import { MapWrapper } from '@/components/zones/map-wrapper';
import { FISHING_ZONES } from '@/lib/zones';
import { readFile } from 'fs/promises';
import path from 'path';
import type { DailyDataFile } from '@/types';

export const revalidate = 3600;

async function getData(): Promise<DailyDataFile | null> {
  try {
    const raw = await readFile(path.join(process.cwd(), 'public', 'data', 'daily.json'), 'utf-8');
    return JSON.parse(raw);
  } catch { return null; }
}

export default async function ZonesPage() {
  const data = await getData();

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Zonas de Pesca" subtitle="Mapa interactivo — haz clic en una zona" />
      <div className="flex-1 p-4 md:p-6 flex flex-col gap-4">
        <div className="flex-1 min-h-[400px] rounded-xl border border-border overflow-hidden">
          <MapWrapper zones={FISHING_ZONES} fishing={data?.fishing ?? []} />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {FISHING_ZONES.map((zone) => {
            const fish = data?.fishing.find((f) => f.zoneId === zone.id);
            const rating = fish?.rating ?? 'fair';
            const RATING_BORDER: Record<string, string> = {
              excellent: 'var(--excellent)', good: 'var(--good)', fair: 'var(--fair)', poor: 'var(--poor)',
            };
            return (
              <div
                key={zone.id}
                className="rounded-lg border-l-4 border border-border bg-surface p-3"
                style={{ borderLeftColor: RATING_BORDER[rating] }}
              >
                <p className="text-xs font-semibold text-foreground truncate">{zone.name}</p>
                <p className="text-[10px] text-muted mt-0.5 font-mono">
                  {zone.lat.toFixed(1)}°N, {Math.abs(zone.lon).toFixed(1)}°O
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`text-[10px] font-bold badge-${rating} px-2 py-0.5 rounded-full`}>
                    {{ excellent: 'Excelente', good: 'Bueno', fair: 'Regular', poor: 'Malo' }[rating] ?? rating}
                  </span>
                  {fish && <span className="text-xs font-bold font-mono text-foreground">{fish.score}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
