'use client';

import { useState } from 'react';
import { useCreateContainer } from '@/hooks/use-containers';
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
import type { ContainerType, ContainerSize, ContainerStatus } from '@/types';

interface CreateContainerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateContainerModal({ open, onOpenChange }: CreateContainerModalProps) {
  const createContainer = useCreateContainer();

  const [form, setForm] = useState({
    container_number: '',
    type: 'dry' as ContainerType,
    size: '20ft' as ContainerSize,
    status: 'empty' as ContainerStatus,
    weight: '',
    max_weight: '',
    temperature: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.container_number.trim()) newErrors.container_number = 'Container number is required';
    if (!form.weight || isNaN(Number(form.weight))) newErrors.weight = 'Valid weight is required';
    if (!form.max_weight || isNaN(Number(form.max_weight)))
      newErrors.max_weight = 'Valid max weight is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await createContainer.mutateAsync({
      ...form,
      weight: Number(form.weight),
      max_weight: Number(form.max_weight),
      temperature: form.temperature ? Number(form.temperature) : undefined,
      is_active: true,
    });
    onOpenChange(false);
    setForm({
      container_number: '',
      type: 'dry',
      size: '20ft',
      status: 'empty',
      weight: '',
      max_weight: '',
      temperature: '',
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Container</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="container_number">Container Number *</Label>
              <Input
                id="container_number"
                value={form.container_number}
                onChange={(e) => setForm({ ...form, container_number: e.target.value })}
                placeholder="MSCU1234567"
                className="font-mono"
              />
              {errors.container_number && (
                <p className="text-xs text-[#EF4444]">{errors.container_number}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v as ContainerType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dry">Dry</SelectItem>
                  <SelectItem value="refrigerated">Refrigerated</SelectItem>
                  <SelectItem value="tank">Tank</SelectItem>
                  <SelectItem value="flat_rack">Flat Rack</SelectItem>
                  <SelectItem value="open_top">Open Top</SelectItem>
                  <SelectItem value="high_cube">High Cube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Size</Label>
              <Select
                value={form.size}
                onValueChange={(v) => setForm({ ...form, size: v as ContainerSize })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20ft">20ft</SelectItem>
                  <SelectItem value="40ft">40ft</SelectItem>
                  <SelectItem value="45ft">45ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="5000"
              />
              {errors.weight && <p className="text-xs text-[#EF4444]">{errors.weight}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="max_weight">Max Weight (kg) *</Label>
              <Input
                id="max_weight"
                type="number"
                value={form.max_weight}
                onChange={(e) => setForm({ ...form, max_weight: e.target.value })}
                placeholder="28000"
              />
              {errors.max_weight && <p className="text-xs text-[#EF4444]">{errors.max_weight}</p>}
            </div>
            {form.type === 'refrigerated' && (
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={form.temperature}
                  onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                  placeholder="-18"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createContainer.isPending}>
              {createContainer.isPending ? 'Creating...' : 'Create Container'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
