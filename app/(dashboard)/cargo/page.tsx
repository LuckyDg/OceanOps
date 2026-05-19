'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { CargoTable } from '@/components/cargo/cargo-table';
import { CreateCargoModal } from '@/components/cargo/create-cargo-modal';
import { Button } from '@/components/ui/button';

export default function CargoPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col">
      <Topbar title="Cargo" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#F9FAFB]">Cargo Management</h2>
            <p className="text-sm text-[#6B7280]">Monitor all cargo shipments and flagged items</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Cargo
          </Button>
        </div>
        <CargoTable />
        <CreateCargoModal open={showCreate} onOpenChange={setShowCreate} />
      </div>
    </div>
  );
}
