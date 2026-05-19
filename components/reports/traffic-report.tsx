'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Download } from 'lucide-react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { TrafficReportData } from '@/types';

export function TrafficReport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [enabled, setEnabled] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'traffic', { startDate, endDate }],
    queryFn: async () => {
      const { data } = await api.get<TrafficReportData[]>('/reports/traffic', {
        params: {
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        },
      });
      return data;
    },
    enabled,
  });

  function handleExportCsv() {
    if (!data) return;
    const headers = ['Port', 'Shipments', 'Volume', 'Period'];
    const rows = data.map((d) => [d.port, d.shipments, d.volume, d.period]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'traffic-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Traffic Report</CardTitle>
        {data && (
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="start">Start Date</Label>
            <Input
              id="start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-44"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="end">End Date</Label>
            <Input
              id="end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-44"
            />
          </div>
          <Button onClick={() => setEnabled(true)}>Generate Report</Button>
        </div>

        {isLoading && (
          <div className="h-[300px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        )}

        {data && data.length > 0 && (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="port" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#1F2937' }} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '8px', color: '#F9FAFB' }} />
                <Legend wrapperStyle={{ color: '#6B7280' }} />
                <Bar dataKey="shipments" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Shipments" />
                <Bar dataKey="volume" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {data && data.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-[#6B7280]">
            No traffic data for the selected period.
          </div>
        )}

        {!data && !isLoading && (
          <div className="flex h-[200px] items-center justify-center text-[#6B7280]">
            Select a date range and click Generate Report.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
