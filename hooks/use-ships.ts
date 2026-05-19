'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import type { Ship, PaginatedResponse, ShipListParams } from '@/types';

export function useShips(params: ShipListParams = {}) {
  return useQuery({
    queryKey: ['ships', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Ship>>('/ships', { params });
      return data;
    },
  });
}

export function useShip(id: string) {
  return useQuery({
    queryKey: ['ships', id],
    queryFn: async () => {
      const { data } = await api.get<Ship>(`/ships/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateShip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ship: Partial<Ship>) => {
      const { data } = await api.post<Ship>('/ships', ship);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ships'] });
      toast.success('Vessel created successfully');
    },
    onError: () => {
      toast.error('Failed to create vessel');
    },
  });
}

export function useUpdateShip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Ship> & { id: string }) => {
      const { data } = await api.patch<Ship>(`/ships/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ships'] });
      toast.success('Vessel updated successfully');
    },
    onError: () => {
      toast.error('Failed to update vessel');
    },
  });
}

export function useDeleteShip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/ships/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ships'] });
      toast.success('Vessel deactivated');
    },
    onError: () => {
      toast.error('Failed to deactivate vessel');
    },
  });
}
