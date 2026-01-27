'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { availabilityApi, type SetAvailabilityInput } from '@/lib/api/availability';
import { queryKeys } from '@/lib/query/keys';

export function useMyAvailability(gymId?: string) {
  return useQuery({
    queryKey: [...queryKeys.coaches.all, 'availability', gymId],
    queryFn: () => availabilityApi.getMyAvailability(gymId),
  });
}

export function useSetAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SetAvailabilityInput) => availabilityApi.setAvailability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.coaches.all, 'availability'] });
    },
  });
}

export function useDeleteAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gymId?: string) => availabilityApi.deleteAvailability(gymId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.coaches.all, 'availability'] });
    },
  });
}
