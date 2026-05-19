'use client';

import { Ship, Package, Anchor, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useShips } from '@/hooks/use-ships';
import { useContainers } from '@/hooks/use-containers';
import { usePorts } from '@/hooks/use-ports';
import { useCargo } from '@/hooks/use-cargo';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isLoading?: boolean;
}

function KpiCard({ title, value, subtitle, icon: Icon, color, isLoading }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#6B7280]">{title}</p>
            {isLoading ? (
              <Skeleton className="mt-2 h-8 w-20" />
            ) : (
              <p className="mt-1 text-3xl font-bold text-[#F9FAFB]">{value}</p>
            )}
            <p className="mt-1 text-xs text-[#6B7280]">{subtitle}</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiCards() {
  const { data: ships, isLoading: shipsLoading } = useShips({ limit: 1 });
  const { data: containers, isLoading: containersLoading } = useContainers({ limit: 1 });
  const { data: ports, isLoading: portsLoading } = usePorts({ limit: 1 });
  const { data: flaggedCargo, isLoading: cargoLoading } = useCargo({
    is_illegal: true,
    limit: 1,
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Vessels at Sea"
        value={ships?.total ?? 0}
        subtitle="Active fleet"
        icon={Ship}
        color="bg-[#3B82F6]"
        isLoading={shipsLoading}
      />
      <KpiCard
        title="Containers in Transit"
        value={containers?.total ?? 0}
        subtitle="Total tracked"
        icon={Package}
        color="bg-[#06B6D4]"
        isLoading={containersLoading}
      />
      <KpiCard
        title="Active Ports"
        value={ports?.total ?? 0}
        subtitle="Operational"
        icon={Anchor}
        color="bg-[#10B981]"
        isLoading={portsLoading}
      />
      <KpiCard
        title="Flagged Cargo"
        value={flaggedCargo?.total ?? 0}
        subtitle="Requires review"
        icon={AlertTriangle}
        color="bg-[#EF4444]"
        isLoading={cargoLoading}
      />
    </div>
  );
}
