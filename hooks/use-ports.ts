'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import type { Port, PaginatedResponse, PortListParams } from '@/types';

export function usePorts(params: PortListParams = {}) {
  return useQuery({
    queryKey: ['ports', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Port>>('/ports', { params });
      return data;
    },
  });
}

export function usePort(id: string) {
  return useQuery({
    queryKey: ['ports', id],
    queryFn: async () => {
      const { data } = await api.get<Port>(`/ports/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePort() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (port: Partial<Port>) => {
      const { data } = await api.post<Port>('/ports', port);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ports'] });
      toast.success('Port created successfully');
    },
    onError: () => {
      toast.error('Failed to create port');
    },
  });
}

export function useUpdatePort() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Port> & { id: string }) => {
      const { data } = await api.patch<Port>(`/ports/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ports'] });
      toast.success('Port updated');
    },
    onError: () => {
      toast.error('Failed to update port');
    },
  });
}

export function useDeletePort() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/ports/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ports'] });
      toast.success('Port removed');
    },
    onError: () => {
      toast.error('Failed to remove port');
    },
  });
}
