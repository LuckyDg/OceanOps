import { Topbar } from '@/components/layout/topbar';
import { KpiCards } from '@/components/dashboard/kpi-cards';
import { WorldMap } from '@/components/dashboard/world-map';
import { CargoChart } from '@/components/dashboard/cargo-chart';
import { ActivityFeed } from '@/components/dashboard/activity-feed';

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Topbar title="Dashboard" />
      <div className="flex-1 p-6 space-y-6">
        <KpiCards />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <WorldMap />
          </div>
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
        </div>
        <CargoChart />
      </div>
    </div>
  );
}
