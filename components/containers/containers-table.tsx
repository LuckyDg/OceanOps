'use client';

import { useState } from 'react';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { useContainers, useDeleteContainer } from '@/hooks/use-containers';
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
import type { ContainerStatus, ContainerType } from '@/types';

const statusVariant: Record<ContainerStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted'> = {
  empty: 'muted',
  loaded: 'default',
  in_transit: 'secondary',
  in_port: 'success',
  delivered: 'success',
  damaged: 'destructive',
};

export function ContainersTable() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ContainerStatus | 'all'>('all');
  const [type, setType] = useState<ContainerType | 'all'>('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useContainers({
    page,
    limit,
    search: search || undefined,
    status: status !== 'all' ? status : undefined,
    type: type !== 'all' ? type : undefined,
  });

  const deleteMutation = useDeleteContainer();

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
          placeholder="Search containers..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-64"
        />
        <Select value={status} onValueChange={(v) => { setStatus(v as ContainerStatus | 'all'); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="empty">Empty</SelectItem>
            <SelectItem value="loaded">Loaded</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="in_port">In Port</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="damaged">Damaged</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={(v) => { setType(v as ContainerType | 'all'); setPage(1); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="dry">Dry</SelectItem>
            <SelectItem value="refrigerated">Refrigerated</SelectItem>
            <SelectItem value="tank">Tank</SelectItem>
            <SelectItem value="flat_rack">Flat Rack</SelectItem>
            <SelectItem value="open_top">Open Top</SelectItem>
            <SelectItem value="high_cube">High Cube</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-[#1F2937]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Container #</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Temperature</TableHead>
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
              : data?.data.map((container) => (
                  <TableRow key={container.id}>
                    <TableCell className="font-mono text-sm font-medium text-[#F9FAFB]">
                      {container.container_number}
                    </TableCell>
                    <TableCell className="capitalize text-[#6B7280]">
                      {container.type.replace('_', ' ')}
                    </TableCell>
                    <TableCell className="text-[#6B7280]">{container.size}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[container.status]}>
                        {container.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#6B7280]">
                      {container.weight.toLocaleString()} kg
                    </TableCell>
                    <TableCell>
                      {container.type === 'refrigerated' && container.temperature !== undefined ? (
                        <span
                          className={`font-medium ${container.temperature > 5 ? 'text-[#EF4444]' : 'text-[#06B6D4]'}`}
                        >
                          {container.temperature}°C
                        </span>
                      ) : (
                        <span className="text-[#374151]">—</span>
                      )}
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
                            onClick={() => setDeleteId(container.id)}
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
            <AlertDialogTitle>Remove Container?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the container from the system. This action cannot be undone.
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
