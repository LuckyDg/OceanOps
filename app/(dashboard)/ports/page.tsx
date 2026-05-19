import { Topbar } from '@/components/layout/topbar';
import { PortsGrid } from '@/components/ports/ports-grid';

export default function PortsPage() {
  return (
    <div className="flex flex-col">
      <Topbar title="Ports" />
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-[#F9FAFB]">Port Directory</h2>
          <p className="text-sm text-[#6B7280]">
            Browse and manage all registered ports and terminals
          </p>
        </div>
        <PortsGrid />
      </div>
    </div>
  );
}
