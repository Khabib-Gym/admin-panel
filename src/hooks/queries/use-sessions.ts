'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type CompleteSessionInput, type SessionListParams, sessionsApi } from '@/lib/api/sessions';
import { queryKeys } from '@/lib/query/keys';

export function useMySessions(params?: SessionListParams) {
  return useQuery({
    queryKey: queryKeys.sessions.list(params || {}),
    queryFn: () => sessionsApi.getMySessions(params),
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(id),
    queryFn: () => sessionsApi.getById(id),
    enabled: !!id,
  });
}

export function useCompleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompleteSessionInput }) =>
      sessionsApi.complete(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(id) });
    },
  });
}

export function useCancelSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => sessionsApi.cancel(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(id) });
    },
  });
}
