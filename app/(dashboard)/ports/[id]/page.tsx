'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Ship, Package } from 'lucide-react';
import { usePort } from '@/hooks/use-ports';
import { Topbar } from '@/components/layout/topbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/utils';

export default function PortDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: port, isLoading } = usePort(id);

  return (
    <div className="flex flex-col">
      <Topbar title="Port Detail" />
      <div className="flex-1 p-6 space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/ports" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Ports
          </Link>
        </Button>

        {isLoading ? (
          <Skeleton className="h-64" />
        ) : port ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#3B82F6]" />
                      {port.name}
                    </CardTitle>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      {port.city}, {port.country} · LOCODE: {port.code}
                    </p>
                  </div>
                  <Badge variant={port.is_operational ? 'success' : 'destructive'}>
                    {port.is_operational ? 'Operational' : 'Offline'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {[
                      { label: 'Type', value: port.type },
                      { label: 'Size', value: port.size },
                      { label: 'Max Ships', value: port.max_ships },
                      { label: 'Max Containers', value: port.max_containers.toLocaleString() },
                      { label: 'Max Draft', value: `${port.max_draft} m` },
                      { label: 'Last Inspection', value: formatDate(port.last_inspection) },
                      { label: 'Coordinates', value: `${port.latitude.toFixed(2)}, ${port.longitude.toFixed(2)}` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-[#6B7280]">{label}</p>
                        <p className="mt-0.5 text-sm capitalize font-medium text-[#F9FAFB]">
                          {String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Ship className="h-4 w-4" />
                    Ship Capacity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#F9FAFB]">{port.max_ships}</p>
                  <p className="text-xs text-[#6B7280]">Maximum berths</p>
                  <Progress value={60} className="mt-3" />
                  <p className="mt-1 text-xs text-right text-[#6B7280]">~60% occupied</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4" />
                    Container Capacity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#F9FAFB]">
                    {port.max_containers.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#6B7280]">TEU capacity</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-[#6B7280]">
            Port not found.
          </div>
        )}
      </div>
    </div>
  );
}
