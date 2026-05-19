'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Topbar } from '@/components/layout/topbar';
import { UsersTable } from '@/components/users/users-table';
import { InviteUserModal } from '@/components/users/invite-user-modal';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="flex flex-col">
      <Topbar title="Users" />
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#F9FAFB]">User Management</h2>
            <p className="text-sm text-[#6B7280]">Manage team members and their access levels</p>
          </div>
          <Button onClick={() => setShowInvite(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite User
          </Button>
        </div>
        <UsersTable />
        <InviteUserModal open={showInvite} onOpenChange={setShowInvite} />
      </div>
    </div>
  );
}
