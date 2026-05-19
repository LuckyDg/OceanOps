'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const mockData = [
  { port: 'Shanghai', volume: 4200 },
  { port: 'Singapore', volume: 3800 },
  { port: 'Rotterdam', volume: 2900 },
  { port: 'Hamburg', volume: 2100 },
  { port: 'Los Angeles', volume: 1900 },
  { port: 'Dubai', volume: 1600 },
  { port: 'Busan', volume: 1400 },
];

export function CargoChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cargo Volume by Port</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis
                dataKey="port"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#1F2937' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #1F2937',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                }}
                cursor={{ fill: '#1F2937' }}
              />
              <Bar dataKey="volume" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
