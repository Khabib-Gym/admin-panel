'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AchievementForm } from '@/components/forms/achievement-form';
import { useAchievement, useUpdateAchievement } from '@/hooks/queries/use-achievements';
import type { AchievementFormValues } from '@/lib/validations/achievement';

interface AchievementEditProps {
  achievementId: string;
}

export function AchievementEdit({ achievementId }: AchievementEditProps) {
  const router = useRouter();
  const { data: achievement, isLoading } = useAchievement(achievementId);
  const { mutate: updateAchievement, isPending } = useUpdateAchievement();

  const handleSubmit = (data: AchievementFormValues) => {
    updateAchievement(
      {
        id: achievementId,
        data: {
          name: data.name,
          description: data.description || undefined,
          icon_url: data.icon_url || undefined,
          category: data.category,
          requirement_type: data.requirement_type,
          requirement_value: data.requirement_value,
          points: data.points,
          display_order: data.display_order,
        },
      },
      {
        onSuccess: () => {
          toast.success('Achievement updated');
          router.push('/achievements');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update achievement');
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!achievement) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Achievement not found</p>
      </div>
    );
  }

  const initialData: AchievementFormValues = {
    name: achievement.name,
    description: achievement.description ?? '',
    icon_url: achievement.icon_url ?? '',
    category: achievement.category as AchievementFormValues['category'],
    requirement_type: achievement.requirement_type as AchievementFormValues['requirement_type'],
    requirement_value: achievement.requirement_value,
    points: achievement.points ?? 0,
    display_order: achievement.display_order ?? 0,
  };

  return (
    <AchievementForm
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isPending}
      submitLabel="Update Achievement"
    />
  );
}
