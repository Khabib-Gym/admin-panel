'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { GymForm } from '@/components/forms/gym-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateGym } from '@/hooks/queries/use-gyms';
import type { CreateGymInput } from '@/lib/api/gyms';
import type { GymFormValues } from '@/lib/validations/gym';

export function NewGym() {
  const router = useRouter();
  const { mutate: createGym, isPending } = useCreateGym();

  const handleSubmit = (data: GymFormValues) => {
    createGym(data as CreateGymInput, {
      onSuccess: (gym) => {
        toast.success('Gym created successfully');
        router.push(`/gyms/${gym.id}`);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create gym');
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/gyms">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Gym</h1>
          <p className="text-muted-foreground">Create a new gym location</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Gym Details</CardTitle>
          <CardDescription>Enter the details for the new gym location</CardDescription>
        </CardHeader>
        <CardContent>
          <GymForm onSubmit={handleSubmit} isLoading={isPending} submitLabel="Create Gym" />
        </CardContent>
      </Card>
    </div>
  );
}
