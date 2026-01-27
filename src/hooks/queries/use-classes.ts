'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type ClassListParams,
  type CreateClassInput,
  classesApi,
  type UpdateClassInput,
} from '@/lib/api/classes';
import { queryKeys } from '@/lib/query/keys';

export function useClasses(params?: ClassListParams) {
  return useQuery({
    queryKey: queryKeys.classes.list((params as Record<string, unknown>) || {}),
    queryFn: () => classesApi.list(params),
  });
}

export function useClass(id: string) {
  return useQuery({
    queryKey: queryKeys.classes.detail(id),
    queryFn: () => classesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassInput) => classesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassInput }) =>
      classesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.detail(id) });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all });
    },
  });
}

export function useStartClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classesApi.start(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.detail(id) });
    },
  });
}

export function useCompleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classesApi.complete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.detail(id) });
    },
  });
}

export function useCancelClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classesApi.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.detail(id) });
    },
  });
}

export function useClassBookings(classId: string) {
  return useQuery({
    queryKey: queryKeys.classes.bookings(classId),
    queryFn: () => classesApi.getBookings(classId),
    enabled: !!classId,
  });
}

export function useCheckInBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, bookingId }: { classId: string; bookingId: string }) =>
      classesApi.checkIn(classId, bookingId),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.bookings(classId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.detail(classId) });
    },
  });
}

export function useMarkNoShow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, bookingId }: { classId: string; bookingId: string }) =>
      classesApi.markNoShow(classId, bookingId),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.bookings(classId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.classes.detail(classId) });
    },
  });
}
