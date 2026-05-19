'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { VesselsTable } from '@/components/vessels/vessels-table';
import { CreateVesselModal } from '@/components/vessels/create-vessel-modal';
import { Button } from '@/components/ui/button';

export default function VesselsPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col">
      <Topbar title="Vessels" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#F9FAFB]">Fleet Management</h2>
            <p className="text-sm text-[#6B7280]">Manage and monitor all vessels in the fleet</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Vessel
          </Button>
        </div>
        <VesselsTable />
        <CreateVesselModal open={showCreate} onOpenChange={setShowCreate} />
      </div>
    </div>
  );
}
