'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import type { Cargo, PaginatedResponse, CargoListParams } from '@/types';

export function useCargo(params: CargoListParams = {}) {
  return useQuery({
    queryKey: ['cargo', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Cargo>>('/cargo', { params });
      return data;
    },
  });
}

export function useCargoItem(id: string) {
  return useQuery({
    queryKey: ['cargo', id],
    queryFn: async () => {
      const { data } = await api.get<Cargo>(`/cargo/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateCargo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cargo: Partial<Cargo>) => {
      const { data } = await api.post<Cargo>('/cargo', cargo);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargo'] });
      toast.success('Cargo created successfully');
    },
    onError: () => {
      toast.error('Failed to create cargo');
    },
  });
}

export function useUpdateCargo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Cargo> & { id: string }) => {
      const { data } = await api.patch<Cargo>(`/cargo/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargo'] });
      toast.success('Cargo updated');
    },
    onError: () => {
      toast.error('Failed to update cargo');
    },
  });
}

export function useDeleteCargo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/cargo/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cargo'] });
      toast.success('Cargo removed');
    },
    onError: () => {
      toast.error('Failed to remove cargo');
    },
  });
}
