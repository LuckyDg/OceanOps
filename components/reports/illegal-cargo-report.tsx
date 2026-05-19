'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, AlertTriangle } from 'lucide-react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import type { IllegalCargoItem } from '@/types';

export function IllegalCargoReport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [enabled, setEnabled] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'illegal-cargo', { startDate, endDate }],
    queryFn: async () => {
      const { data } = await api.get<IllegalCargoItem[]>('/reports/illegal-cargo', {
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
    const headers = [
      'Tracking #',
      'Description',
      'Illegal Reason',
      'Shipper',
      'Origin',
      'Destination',
      'Detected At',
    ];
    const rows = data.map((d) => [
      d.tracking_number,
      `"${d.description}"`,
      `"${d.illegal_reason}"`,
      d.shipper_name,
      d.origin,
      d.destination,
      d.detected_at,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'illegal-cargo-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
          <CardTitle>Illegal Cargo Report</CardTitle>
        </div>
        {data && data.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="illegal-start">Start Date</Label>
            <Input
              id="illegal-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-44"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="illegal-end">End Date</Label>
            <Input
              id="illegal-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-44"
            />
          </div>
          <Button onClick={() => setEnabled(true)}>Generate Report</Button>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        )}

        {data && data.length > 0 && (
          <div className="rounded-lg border border-[#1F2937]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Illegal Reason</TableHead>
                  <TableHead>Shipper</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Detected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id} className="border-l-2 border-l-[#EF4444]">
                    <TableCell className="font-mono text-xs text-[#6B7280]">
                      {item.tracking_number}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-[#F9FAFB]">
                      {item.description}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-[#EF4444]">
                      {item.illegal_reason}
                    </TableCell>
                    <TableCell className="text-sm text-[#6B7280]">{item.shipper_name}</TableCell>
                    <TableCell className="text-xs text-[#6B7280]">
                      {item.origin} → {item.destination}
                    </TableCell>
                    <TableCell className="text-xs text-[#6B7280]">
                      {formatDate(item.detected_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {data && data.length === 0 && (
          <div className="flex h-[200px] items-center justify-center text-[#10B981]">
            No illegal cargo detected in the selected period.
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
