'use client';

import { useState } from 'react';
import { useCreateShip } from '@/hooks/use-ships';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ShipType, ShipStatus } from '@/types';

interface CreateVesselModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateVesselModal({ open, onOpenChange }: CreateVesselModalProps) {
  const createShip = useCreateShip();

  const [form, setForm] = useState({
    name: '',
    imo_number: '',
    call_sign: '',
    type: 'cargo' as ShipType,
    status: 'in_port' as ShipStatus,
    length: '',
    width: '',
    draft: '',
    gross_tonnage: '',
    deadweight_tonnage: '',
    max_containers: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.imo_number.trim()) newErrors.imo_number = 'IMO number is required';
    if (!form.call_sign.trim()) newErrors.call_sign = 'Call sign is required';
    if (!form.gross_tonnage || isNaN(Number(form.gross_tonnage)))
      newErrors.gross_tonnage = 'Valid gross tonnage is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await createShip.mutateAsync({
      ...form,
      length: Number(form.length),
      width: Number(form.width),
      draft: Number(form.draft),
      gross_tonnage: Number(form.gross_tonnage),
      deadweight_tonnage: Number(form.deadweight_tonnage),
      max_containers: Number(form.max_containers),
      is_active: true,
    });
    onOpenChange(false);
    setForm({
      name: '',
      imo_number: '',
      call_sign: '',
      type: 'cargo',
      status: 'in_port',
      length: '',
      width: '',
      draft: '',
      gross_tonnage: '',
      deadweight_tonnage: '',
      max_containers: '',
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Vessel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Vessel Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="MV Example"
              />
              {errors.name && <p className="text-xs text-[#EF4444]">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="imo">IMO Number *</Label>
              <Input
                id="imo"
                value={form.imo_number}
                onChange={(e) => setForm({ ...form, imo_number: e.target.value })}
                placeholder="IMO1234567"
              />
              {errors.imo_number && <p className="text-xs text-[#EF4444]">{errors.imo_number}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="call_sign">Call Sign *</Label>
              <Input
                id="call_sign"
                value={form.call_sign}
                onChange={(e) => setForm({ ...form, call_sign: e.target.value })}
                placeholder="ABCD1"
              />
              {errors.call_sign && <p className="text-xs text-[#EF4444]">{errors.call_sign}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v as ShipType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cargo">Cargo</SelectItem>
                  <SelectItem value="container">Container</SelectItem>
                  <SelectItem value="tanker">Tanker</SelectItem>
                  <SelectItem value="bulk_carrier">Bulk Carrier</SelectItem>
                  <SelectItem value="roll_on_roll_off">RoRo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as ShipStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_port">In Port</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out_of_service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gross_tonnage">Gross Tonnage *</Label>
              <Input
                id="gross_tonnage"
                type="number"
                value={form.gross_tonnage}
                onChange={(e) => setForm({ ...form, gross_tonnage: e.target.value })}
                placeholder="50000"
              />
              {errors.gross_tonnage && (
                <p className="text-xs text-[#EF4444]">{errors.gross_tonnage}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="deadweight">Deadweight Tonnage</Label>
              <Input
                id="deadweight"
                type="number"
                value={form.deadweight_tonnage}
                onChange={(e) => setForm({ ...form, deadweight_tonnage: e.target.value })}
                placeholder="40000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="max_containers">Max Containers</Label>
              <Input
                id="max_containers"
                type="number"
                value={form.max_containers}
                onChange={(e) => setForm({ ...form, max_containers: e.target.value })}
                placeholder="1000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="length">Length (m)</Label>
              <Input
                id="length"
                type="number"
                value={form.length}
                onChange={(e) => setForm({ ...form, length: e.target.value })}
                placeholder="300"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="width">Width (m)</Label>
              <Input
                id="width"
                type="number"
                value={form.width}
                onChange={(e) => setForm({ ...form, width: e.target.value })}
                placeholder="45"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createShip.isPending}>
              {createShip.isPending ? 'Creating...' : 'Create Vessel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
