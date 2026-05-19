'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Ship, Package } from 'lucide-react';
import { useShip } from '@/hooks/use-ships';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Topbar } from '@/components/layout/topbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import type { Container, PaginatedResponse } from '@/types';

const statusBadge = {
  in_port: { label: 'In Port', variant: 'secondary' as const },
  in_transit: { label: 'In Transit', variant: 'default' as const },
  maintenance: { label: 'Maintenance', variant: 'warning' as const },
  out_of_service: { label: 'Out of Service', variant: 'muted' as const },
};

export default function VesselDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: ship, isLoading } = useShip(id);

  const { data: containers } = useQuery({
    queryKey: ['ships', id, 'containers'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Container>>(`/ships/${id}/containers`);
      return data;
    },
    enabled: !!id,
  });

  return (
    <div className="flex flex-col">
      <Topbar title="Vessel Detail" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/vessels" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Vessels
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="h-64" />
            </div>
            <Skeleton className="h-64" />
          </div>
        ) : ship ? (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3B82F6]/10">
                        <Ship className="h-5 w-5 text-[#3B82F6]" />
                      </div>
                      <div>
                        <CardTitle>{ship.name}</CardTitle>
                        <p className="text-sm text-[#6B7280]">IMO {ship.imo_number}</p>
                      </div>
                    </div>
                    <Badge variant={statusBadge[ship.status].variant}>
                      {statusBadge[ship.status].label}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {[
                        { label: 'Call Sign', value: ship.call_sign },
                        { label: 'Type', value: ship.type.replace('_', ' ') },
                        { label: 'Gross Tonnage', value: `${ship.gross_tonnage.toLocaleString()} t` },
                        { label: 'Deadweight', value: `${ship.deadweight_tonnage.toLocaleString()} t` },
                        { label: 'Max Containers', value: ship.max_containers.toLocaleString() },
                        { label: 'Length', value: `${ship.length} m` },
                        { label: 'Width', value: `${ship.width} m` },
                        { label: 'Draft', value: `${ship.draft} m` },
                        { label: 'Est. Arrival', value: formatDate(ship.estimated_arrival) },
                        { label: 'Est. Departure', value: formatDate(ship.estimated_departure) },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-xs text-[#6B7280]">{label}</p>
                          <p className="mt-0.5 text-sm capitalize font-medium text-[#F9FAFB]">{value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Containers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6B7280]">Total aboard</span>
                        <span className="text-2xl font-bold text-[#F9FAFB]">
                          {containers?.total ?? '—'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#6B7280]">Capacity</span>
                        <span className="text-sm text-[#F9FAFB]">{ship.max_containers}</span>
                      </div>
                      {containers && ship.max_containers > 0 && (
                        <div className="space-y-1.5">
                          <div className="h-2 rounded-full bg-[#1F2937]">
                            <div
                              className="h-2 rounded-full bg-[#3B82F6]"
                              style={{
                                width: `${Math.min(100, (containers.total / ship.max_containers) * 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-right text-[#6B7280]">
                            {Math.round((containers.total / ship.max_containers) * 100)}% utilized
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-64 items-center justify-center text-[#6B7280]">
            Vessel not found.
          </div>
        )}
      </div>
    </div>
  );
}
