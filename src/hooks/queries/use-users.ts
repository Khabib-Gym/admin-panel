'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type ChangePasswordInput,
  type UpdatePreferencesInput,
  type UpdateUserInput,
  type UpdateUserRoleInput,
  type UserListParams,
  usersApi,
} from '@/lib/api/users';
import { queryKeys } from '@/lib/query/keys';

export function useUsers(params?: UserListParams) {
  return useQuery({
    queryKey: queryKeys.users.list((params as Record<string, unknown>) || {}),
    queryFn: () => usersApi.list(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) => usersApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      new_role,
      reason,
    }: {
      id: string;
      new_role: UpdateUserRoleInput['new_role'];
      reason?: string;
    }) => usersApi.updateRole(id, { new_role, reason }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.users.detail('me'),
    queryFn: () => usersApi.getMe(),
  });
}

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserInput) => usersApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail('me') });
    },
  });
}

export function useUserPreferences() {
  return useQuery({
    queryKey: ['user', 'preferences'],
    queryFn: () => usersApi.getPreferences(),
  });
}

export function useUpdateUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePreferencesInput) => usersApi.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'preferences'] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) => usersApi.changePassword(data),
  });
}
