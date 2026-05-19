'use client';

import { useState } from 'react';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useShips, useDeleteShip } from '@/hooks/use-ships';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { ShipStatus, ShipType } from '@/types';

const statusBadge: Record<ShipStatus, { label: string; variant: 'secondary' | 'default' | 'warning' | 'muted' }> = {
  in_port: { label: 'In Port', variant: 'secondary' },
  in_transit: { label: 'In Transit', variant: 'default' },
  maintenance: { label: 'Maintenance', variant: 'warning' },
  out_of_service: { label: 'Out of Service', variant: 'muted' },
};

export function VesselsTable() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ShipStatus | 'all'>('all');
  const [type, setType] = useState<ShipType | 'all'>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useShips({
    page,
    limit,
    search: search || undefined,
    status: status !== 'all' ? status : undefined,
    type: type !== 'all' ? type : undefined,
  });

  const deleteMutation = useDeleteShip();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search vessels..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-64"
        />
        <Select value={status} onValueChange={(v) => { setStatus(v as ShipStatus | 'all'); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="in_port">In Port</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="out_of_service">Out of Service</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={(v) => { setType(v as ShipType | 'all'); setPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="cargo">Cargo</SelectItem>
            <SelectItem value="container">Container</SelectItem>
            <SelectItem value="tanker">Tanker</SelectItem>
            <SelectItem value="bulk_carrier">Bulk Carrier</SelectItem>
            <SelectItem value="roll_on_roll_off">RoRo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[#1F2937]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>IMO Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Gross Tonnage</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data?.data.map((ship) => {
                  const badge = statusBadge[ship.status];
                  return (
                    <TableRow key={ship.id}>
                      <TableCell className="font-medium text-[#F9FAFB]">{ship.name}</TableCell>
                      <TableCell className="font-mono text-sm text-[#6B7280]">{ship.imo_number}</TableCell>
                      <TableCell className="capitalize text-[#6B7280]">
                        {ship.type.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={badge.variant as 'secondary' | 'default' | 'muted' | 'destructive' | 'success' | 'warning' | 'outline'}>{badge.label}</Badge>
                      </TableCell>
                      <TableCell className="text-[#6B7280]">
                        {ship.gross_tonnage.toLocaleString()} t
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/vessels/${ship.id}`} className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-[#EF4444] focus:text-[#EF4444]"
                              onClick={() => setDeleteId(ship.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Vessel?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the vessel and remove it from active operations. This action can
              be reversed by an administrator.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Deactivate</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
