'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import type { Container, PaginatedResponse, ContainerListParams } from '@/types';

export function useContainers(params: ContainerListParams = {}) {
  return useQuery({
    queryKey: ['containers', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Container>>('/containers', { params });
      return data;
    },
  });
}

export function useContainer(id: string) {
  return useQuery({
    queryKey: ['containers', id],
    queryFn: async () => {
      const { data } = await api.get<Container>(`/containers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateContainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (container: Partial<Container>) => {
      const { data } = await api.post<Container>('/containers', container);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] });
      toast.success('Container created successfully');
    },
    onError: () => {
      toast.error('Failed to create container');
    },
  });
}

export function useUpdateContainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Container> & { id: string }) => {
      const { data } = await api.patch<Container>(`/containers/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] });
      toast.success('Container updated');
    },
    onError: () => {
      toast.error('Failed to update container');
    },
  });
}

export function useDeleteContainer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/containers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['containers'] });
      toast.success('Container removed');
    },
    onError: () => {
      toast.error('Failed to remove container');
    },
  });
}
