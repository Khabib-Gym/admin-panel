'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AchievementForm } from '@/components/forms/achievement-form';
import { useCreateAchievement } from '@/hooks/queries/use-achievements';
import type { AchievementFormValues } from '@/lib/validations/achievement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function NewAchievementContent() {
  const router = useRouter();
  const { mutate: createAchievement, isPending } = useCreateAchievement();

  const handleSubmit = (data: AchievementFormValues) => {
    createAchievement(
      {
        name: data.name,
        description: data.description || undefined,
        icon_url: data.icon_url || undefined,
        category: data.category,
        requirement_type: data.requirement_type,
        requirement_value: data.requirement_value,
        points: data.points,
        display_order: data.display_order,
      },
      {
        onSuccess: () => {
          toast.success('Achievement created successfully');
          router.push('/achievements');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to create achievement');
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievement Details</CardTitle>
      </CardHeader>
      <CardContent>
        <AchievementForm onSubmit={handleSubmit} isLoading={isPending} />
      </CardContent>
    </Card>
  );
}
