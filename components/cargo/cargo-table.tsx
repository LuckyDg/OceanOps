'use client';

import { useState } from 'react';
import { MoreHorizontal, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { useCargo, useDeleteCargo } from '@/hooks/use-cargo';
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
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import type { CargoStatus, HazardLevel } from '@/types';

const hazardVariant: Record<HazardLevel, 'muted' | 'success' | 'warning' | 'destructive' | 'default'> = {
  none: 'muted',
  low: 'success',
  medium: 'warning',
  high: 'destructive',
  extreme: 'destructive',
};

const statusVariant: Record<CargoStatus, 'muted' | 'warning' | 'default' | 'secondary' | 'success' | 'destructive'> = {
  pending: 'warning',
  loaded: 'default',
  in_transit: 'secondary',
  delivered: 'success',
  damaged: 'destructive',
  lost: 'destructive',
};

export function CargoTable() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CargoStatus | 'all'>('all');
  const [isIllegal, setIsIllegal] = useState<'all' | 'true' | 'false'>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useCargo({
    page,
    limit,
    search: search || undefined,
    status: status !== 'all' ? status : undefined,
    is_illegal: isIllegal === 'all' ? undefined : isIllegal === 'true',
  });

  const deleteMutation = useDeleteCargo();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search cargo..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-64"
        />
        <Select value={status} onValueChange={(v) => { setStatus(v as CargoStatus | 'all'); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="loaded">Loaded</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="damaged">Damaged</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
        <Select value={isIllegal} onValueChange={(v) => { setIsIllegal(v as 'all' | 'true' | 'false'); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Flag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cargo</SelectItem>
            <SelectItem value="true">Flagged Only</SelectItem>
            <SelectItem value="false">Clean Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-[#1F2937]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking #</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Shipper</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hazard</TableHead>
              <TableHead>Flag</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data?.data.map((cargo) => (
                  <TableRow
                    key={cargo.id}
                    className={cn(cargo.is_illegal && 'border-l-2 border-l-[#EF4444]')}
                  >
                    <TableCell className="font-mono text-xs text-[#6B7280]">
                      {cargo.tracking_number}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate font-medium text-[#F9FAFB]">
                      {cargo.description}
                    </TableCell>
                    <TableCell className="text-[#6B7280]">{cargo.shipper_name}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[cargo.status]}>
                        {cargo.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={hazardVariant[cargo.hazard_level]}>
                        {cargo.hazard_level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {cargo.is_illegal ? (
                        <div className="flex items-center gap-1.5 text-[#EF4444]">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">Illegal</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#6B7280]">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-[#6B7280]">
                      {formatDate(cargo.expected_delivery)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-[#EF4444] focus:text-[#EF4444]"
                            onClick={() => setDeleteId(cargo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Cargo?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the cargo record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
