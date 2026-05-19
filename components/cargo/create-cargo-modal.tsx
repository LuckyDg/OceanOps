'use client';

import { useState } from 'react';
import { useCreateCargo } from '@/hooks/use-cargo';
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
import type { CargoType, CargoStatus, HazardLevel } from '@/types';

interface CreateCargoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCargoModal({ open, onOpenChange }: CreateCargoModalProps) {
  const createCargo = useCreateCargo();

  const [form, setForm] = useState({
    description: '',
    type: 'general' as CargoType,
    status: 'pending' as CargoStatus,
    weight: '',
    volume: '',
    value: '',
    origin: '',
    destination: '',
    hazard_level: 'none' as HazardLevel,
    tracking_number: '',
    shipper_name: '',
    consignee_name: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.origin.trim()) newErrors.origin = 'Origin is required';
    if (!form.destination.trim()) newErrors.destination = 'Destination is required';
    if (!form.shipper_name.trim()) newErrors.shipper_name = 'Shipper name is required';
    if (!form.consignee_name.trim()) newErrors.consignee_name = 'Consignee name is required';
    if (!form.weight || isNaN(Number(form.weight))) newErrors.weight = 'Valid weight is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await createCargo.mutateAsync({
      ...form,
      weight: Number(form.weight),
      volume: Number(form.volume),
      value: Number(form.value),
      tracking_number: form.tracking_number || `TRK-${Date.now()}`,
      is_illegal: false,
    });
    onOpenChange(false);
    setForm({
      description: '',
      type: 'general',
      status: 'pending',
      weight: '',
      volume: '',
      value: '',
      origin: '',
      destination: '',
      hazard_level: 'none',
      tracking_number: '',
      shipper_name: '',
      consignee_name: '',
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Cargo Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Cargo description"
              />
              {errors.description && <p className="text-xs text-[#EF4444]">{errors.description}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as CargoType })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="hazardous">Hazardous</SelectItem>
                  <SelectItem value="refrigerated">Refrigerated</SelectItem>
                  <SelectItem value="liquid">Liquid</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="machinery">Machinery</SelectItem>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="chemicals">Chemicals</SelectItem>
                  <SelectItem value="textiles">Textiles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Hazard Level</Label>
              <Select value={form.hazard_level} onValueChange={(v) => setForm({ ...form, hazard_level: v as HazardLevel })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="extreme">Extreme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="origin">Origin *</Label>
              <Input
                id="origin"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                placeholder="Shanghai, China"
              />
              {errors.origin && <p className="text-xs text-[#EF4444]">{errors.origin}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                placeholder="Rotterdam, Netherlands"
              />
              {errors.destination && <p className="text-xs text-[#EF4444]">{errors.destination}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipper">Shipper Name *</Label>
              <Input
                id="shipper"
                value={form.shipper_name}
                onChange={(e) => setForm({ ...form, shipper_name: e.target.value })}
                placeholder="ACME Corp."
              />
              {errors.shipper_name && <p className="text-xs text-[#EF4444]">{errors.shipper_name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="consignee">Consignee Name *</Label>
              <Input
                id="consignee"
                value={form.consignee_name}
                onChange={(e) => setForm({ ...form, consignee_name: e.target.value })}
                placeholder="Buyer Inc."
              />
              {errors.consignee_name && <p className="text-xs text-[#EF4444]">{errors.consignee_name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="10000"
              />
              {errors.weight && <p className="text-xs text-[#EF4444]">{errors.weight}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="volume">Volume (m³)</Label>
              <Input
                id="volume"
                type="number"
                value={form.volume}
                onChange={(e) => setForm({ ...form, volume: e.target.value })}
                placeholder="50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="value">Value (USD)</Label>
              <Input
                id="value"
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="100000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                value={form.tracking_number}
                onChange={(e) => setForm({ ...form, tracking_number: e.target.value })}
                placeholder="Auto-generated if empty"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createCargo.isPending}>
              {createCargo.isPending ? 'Creating...' : 'Create Cargo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
