'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit } from 'lucide-react';
import { useUsers, useUpdateUser } from '@/hooks/use-users';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/utils';
import type { User, UserRole } from '@/types';

const roleVariant: Record<UserRole, 'destructive' | 'default' | 'secondary' | 'muted'> = {
  admin: 'destructive',
  operator: 'default',
  auditor: 'secondary',
  user: 'muted',
};

export function UsersTable() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<UserRole>('user');

  const { data, isLoading } = useUsers({ page, limit, search: search || undefined });
  const updateUser = useUpdateUser();

  const handleEditSave = async () => {
    if (!editUser) return;
    await updateUser.mutateAsync({ id: editUser.id, role: editRole });
    setEditUser(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-64"
        />
      </div>

      <div className="rounded-lg border border-[#1F2937]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data?.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B82F6] text-xs font-bold text-white">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#F9FAFB]">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#6B7280]">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? 'success' : 'muted'}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-[#6B7280]">
                      {formatDate(user.last_login)}
                    </TableCell>
                    <TableCell className="text-xs text-[#6B7280]">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => { setEditUser(user); setEditRole(user.role); }}
                          >
                            <Edit className="h-4 w-4" />
                            Edit Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {data && (
        <div className="flex items-center justify-between text-sm text-[#6B7280]">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <span>
              {(page - 1) * limit + 1}–{Math.min(page * limit, data.total)} of {data.total}
            </span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= data.totalPages}>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>User</Label>
              <p className="text-sm text-[#F9FAFB]">{editUser?.name}</p>
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={editRole} onValueChange={(v) => setEditRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="auditor">Auditor</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={updateUser.isPending}>
              {updateUser.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
