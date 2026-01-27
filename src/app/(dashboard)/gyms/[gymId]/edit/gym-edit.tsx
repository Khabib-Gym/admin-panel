'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { GymForm } from '@/components/forms/gym-form';
import { PageLoader } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGym, useUpdateGym } from '@/hooks/queries/use-gyms';
import type { UpdateGymInput } from '@/lib/api/gyms';
import type { GymFormValues } from '@/lib/validations/gym';

interface GymEditProps {
  gymId: string;
}

export function GymEdit({ gymId }: GymEditProps) {
  const router = useRouter();
  const { data: gymData, isLoading } = useGym(gymId);
  const { mutate: updateGym, isPending } = useUpdateGym();

  const handleSubmit = (data: GymFormValues) => {
    updateGym(
      { id: gymId, data: data as UpdateGymInput },
      {
        onSuccess: () => {
          toast.success('Gym updated successfully');
          router.push(`/gyms/${gymId}`);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update gym');
        },
      },
    );
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!gymData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Gym not found</h2>
        <Button asChild className="mt-4">
          <Link href="/gyms">Back to Gyms</Link>
        </Button>
      </div>
    );
  }

  const gym = gymData.gym;

  const initialData: GymFormValues = {
    name: gym.name,
    slug: gym.slug,
    address: gym.address,
    city: gym.city,
    country: gym.country,
    timezone: gym.timezone,
    latitude: gym.latitude,
    longitude: gym.longitude,
    phone: gym.phone ?? '',
    email: gym.email ?? '',
    opening_hours: gym.opening_hours,
    amenities: gym.amenities,
    image_url: gym.image_url ?? '',
    is_active: gym.is_active,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/gyms/${gymId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Gym</h1>
          <p className="text-muted-foreground">Update gym information</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Gym Details</CardTitle>
          <CardDescription>Update the gym's information and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <GymForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isPending}
            submitLabel="Update Gym"
          />
        </CardContent>
      </Card>
    </div>
  );
}
