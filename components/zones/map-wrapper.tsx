'use client';

import dynamic from 'next/dynamic';
import type { FishingZone, FishingConditions } from '@/types';

const FishingMapClient = dynamic(
  () => import('./fishing-map').then((m) => m.FishingMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-xl bg-surface-hover flex items-center justify-center">
        <p className="text-xs text-muted">Loading map…</p>
      </div>
    ),
  }
);

export function MapWrapper({ zones, fishing }: { zones: FishingZone[]; fishing: FishingConditions[] }) {
  return <FishingMapClient zones={zones} fishing={fishing} />;
}
