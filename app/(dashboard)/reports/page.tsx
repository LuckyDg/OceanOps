import { Topbar } from '@/components/layout/topbar';
import { TrafficReport } from '@/components/reports/traffic-report';
import { IllegalCargoReport } from '@/components/reports/illegal-cargo-report';

export default function ReportsPage() {
  return (
    <div className="flex flex-col">
      <Topbar title="Reports" />
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[#F9FAFB]">Analytics & Reports</h2>
          <p className="text-sm text-[#6B7280]">
            Generate and export operational reports
          </p>
        </div>
        <TrafficReport />
        <IllegalCargoReport />
      </div>
    </div>
  );
}
