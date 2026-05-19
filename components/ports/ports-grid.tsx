'use client';

import { useState } from 'react';
import { MapPin, Ship } from 'lucide-react';
import { usePorts } from '@/hooks/use-ports';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import type { PortType } from '@/types';

export function PortsGrid() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<PortType | 'all'>('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const { data, isLoading } = usePorts({
    page,
    limit,
    search: search || undefined,
    type: type !== 'all' ? type : undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search ports..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-64"
        />
        <Select value={type} onValueChange={(v) => { setType(v as PortType | 'all'); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="industrial">Industrial</SelectItem>
            <SelectItem value="fishing">Fishing</SelectItem>
            <SelectItem value="military">Military</SelectItem>
            <SelectItem value="cruise">Cruise</SelectItem>
            <SelectItem value="mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.data.map((port) => (
          <Card key={port.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#F9FAFB] truncate">{port.name}</h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <MapPin className="h-3 w-3" />
                    {port.city}, {port.country}
                  </div>
                </div>
                <Badge
                  variant={port.is_operational ? 'success' : 'destructive'}
                  className="ml-2 shrink-0"
                >
                  {port.is_operational ? 'Operational' : 'Offline'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">LOCODE</span>
                <span className="font-mono font-medium text-[#F9FAFB]">{port.code}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">Type</span>
                <span className="capitalize text-[#F9FAFB]">{port.type}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">Size</span>
                <span className="capitalize text-[#F9FAFB]">{port.size}</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[#6B7280]">
                    <Ship className="h-3 w-3" />
                    Capacity
                  </div>
                  <span className="text-[#F9FAFB]">{port.max_ships} ships</span>
                </div>
                <Progress value={Math.min(100, (port.max_ships / 50) * 100)} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B7280]">Max Draft</span>
                <span className="text-[#F9FAFB]">{port.max_draft}m</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data && (
        <div className="flex items-center justify-end gap-3 text-sm text-[#6B7280]">
          <span>
            {(page - 1) * limit + 1}–{Math.min(page * limit, data.total)} of {data.total}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
