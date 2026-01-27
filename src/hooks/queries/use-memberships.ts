'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type CreateMembershipAdminInput,
  type MembershipListParams,
  membershipsApi,
  type UpdateMembershipInput,
} from '@/lib/api/memberships';
import { queryKeys } from '@/lib/query/keys';

export function useMemberships(params?: MembershipListParams) {
  return useQuery({
    queryKey: queryKeys.memberships.list((params || {}) as Record<string, unknown>),
    queryFn: () => membershipsApi.list(params),
  });
}

export function useMembership(id: string) {
  return useQuery({
    queryKey: queryKeys.memberships.detail(id),
    queryFn: () => membershipsApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateMembershipAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMembershipInput }) =>
      membershipsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.detail(id) });
    },
  });
}

export function usePauseMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: membershipsApi.pause,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all });
    },
  });
}

export function useResumeMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: membershipsApi.resume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all });
    },
  });
}

export function useCancelMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: membershipsApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all });
    },
  });
}

export function useCreateMembershipAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMembershipAdminInput) => membershipsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all });
    },
  });
}
