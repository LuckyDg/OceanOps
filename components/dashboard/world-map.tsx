'use client';

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const vesselPositions = [
  { name: 'MV Pacific Star', coordinates: [-140, 30] as [number, number], status: 'in_transit' },
  { name: 'MV Atlantic Queen', coordinates: [-40, 50] as [number, number], status: 'in_transit' },
  { name: 'MV Indian Dawn', coordinates: [70, 15] as [number, number], status: 'in_transit' },
  { name: 'MV Arctic Wind', coordinates: [5, 60] as [number, number], status: 'in_port' },
  { name: 'MV Southern Cross', coordinates: [120, -10] as [number, number], status: 'in_transit' },
  { name: 'MV Baltic Sea', coordinates: [20, 55] as [number, number], status: 'maintenance' },
];

const statusColor: Record<string, string> = {
  in_transit: '#3B82F6',
  in_port: '#06B6D4',
  maintenance: '#F59E0B',
  out_of_service: '#6B7280',
};

export function WorldMap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 130 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1F2937"
                    stroke="#0A0F1E"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: '#374151', outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>
            {vesselPositions.map((vessel) => (
              <Marker key={vessel.name} coordinates={vessel.coordinates}>
                <circle
                  r={5}
                  fill={statusColor[vessel.status] ?? '#3B82F6'}
                  stroke="#0A0F1E"
                  strokeWidth={1.5}
                />
                <title>{vessel.name}</title>
              </Marker>
            ))}
          </ComposableMap>
        </div>
        <div className="mt-3 flex flex-wrap gap-4">
          {Object.entries(statusColor).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-[#6B7280] capitalize">{status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
