'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/hooks/use-app-store';
import type { FishingZone, FishingConditions } from '@/types';

const RATING_COLORS: Record<string, string> = {
  excellent: '#34d399',
  good:      '#38bdf8',
  fair:      '#fbbf24',
  poor:      '#f87171',
};

interface Props {
  zones: FishingZone[];
  fishing: FishingConditions[];
}

export function FishingMap({ zones, fishing }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const { selectedZone, setSelectedZone } = useAppStore();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 18,
      }).addTo(map);

      zones.forEach((zone) => {
        const fish = fishing.find((f) => f.zoneId === zone.id);
        const color = RATING_COLORS[fish?.rating ?? 'fair'];

        L.circle([zone.lat, zone.lon], {
          color,
          fillColor: color,
          fillOpacity: 0.12,
          weight: 1.5,
          radius: 200_000,
        }).addTo(map);

        const marker = L.circleMarker([zone.lat, zone.lon], {
          color,
          fillColor: color,
          fillOpacity: 0.9,
          radius: 8,
          weight: 2,
        }).addTo(map);

        const ratingEs: Record<string, string> = {
          excellent: 'Excelente', good: 'Bueno', fair: 'Regular', poor: 'Malo',
        };

        marker.bindPopup(
          `<div style="font-family:system-ui;min-width:160px">
            <b style="color:#ededed;font-size:13px">${zone.name}</b>
            <div style="margin-top:2px;font-size:11px;color:#888">${zone.lat.toFixed(1)}°N, ${Math.abs(zone.lon).toFixed(1)}°O</div>
            ${fish ? `<div style="margin-top:6px;font-size:12px;color:#888">Puntuación: <b style="color:${color}">${fish.score}/100</b> &middot; <b style="color:${color}">${ratingEs[fish.rating] ?? fish.rating}</b></div>` : ''}
          </div>`,
          { className: 'ocean-popup' }
        );

        marker.on('click', () => setSelectedZone(zone.id));
      });

      // Auto-fit to show all zones
      if (zones.length > 0) {
        const bounds = L.latLngBounds(zones.map((z) => [z.lat, z.lon] as [number, number]));
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 5 });
      }

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove(): void }).remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>{`
        .ocean-popup .leaflet-popup-content-wrapper {
          background:#111116;border:1px solid rgba(255,255,255,.08);border-radius:10px;
          box-shadow:0 8px 24px rgba(0,0,0,.5);color:#ededed;
        }
        .ocean-popup .leaflet-popup-tip { background:#111116; }
        .leaflet-container { background:#0a0a0f !important; }
      `}</style>
      <div ref={mapRef} className="w-full h-full rounded-xl" />
    </div>
  );
}
