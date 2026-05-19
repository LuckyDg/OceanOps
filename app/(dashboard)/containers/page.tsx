'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { ContainersTable } from '@/components/containers/containers-table';
import { CreateContainerModal } from '@/components/containers/create-container-modal';
import { Button } from '@/components/ui/button';

export default function ContainersPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col">
      <Topbar title="Containers" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#F9FAFB]">Container Management</h2>
            <p className="text-sm text-[#6B7280]">Track all containers across the fleet</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Container
          </Button>
        </div>
        <ContainersTable />
        <CreateContainerModal open={showCreate} onOpenChange={setShowCreate} />
      </div>
    </div>
  );
}
