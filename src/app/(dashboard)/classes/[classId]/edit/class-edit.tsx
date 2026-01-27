'use client';

import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ClassForm } from '@/components/forms/class-form';
import { PageLoader } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClass, useUpdateClass } from '@/hooks/queries/use-classes';
import type { UpdateClassInput } from '@/lib/api/classes';
import type { ClassFormValues } from '@/lib/validations/class';

interface ClassEditProps {
  classId: string;
}

export function ClassEdit({ classId }: ClassEditProps) {
  const router = useRouter();
  const { data: classItem, isLoading } = useClass(classId);
  const { mutate: updateClass, isPending } = useUpdateClass();

  const handleSubmit = (data: ClassFormValues) => {
    // Convert datetime-local format to ISO format with timezone
    const scheduledAt = new Date(data.scheduled_at).toISOString();

    updateClass(
      { id: classId, data: { ...data, scheduled_at: scheduledAt } as UpdateClassInput },
      {
        onSuccess: () => {
          toast.success('Class updated successfully');
          router.push(`/classes/${classId}`);
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to update class');
        },
      },
    );
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!classItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Class not found</h2>
        <Button asChild className="mt-4">
          <Link href="/classes">Back to Classes</Link>
        </Button>
      </div>
    );
  }

  if (classItem.status !== 'scheduled') {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Cannot edit class</h2>
        <p className="text-muted-foreground mt-2">Only scheduled classes can be edited.</p>
        <Button asChild className="mt-4">
          <Link href={`/classes/${classId}`}>Back to Class</Link>
        </Button>
      </div>
    );
  }

  // Format date for datetime-local input
  const scheduledAt = format(new Date(classItem.scheduled_at), "yyyy-MM-dd'T'HH:mm");

  const initialData: Partial<ClassFormValues> = {
    name: classItem.name,
    type: classItem.type,
    description: classItem.description ?? '',
    scheduled_at: scheduledAt,
    duration_minutes: classItem.duration_minutes,
    capacity: classItem.capacity,
    gym_id: classItem.gym_id,
    room: classItem.room ?? '',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/classes/${classId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Class</h1>
          <p className="text-muted-foreground">Update class details</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
          <CardDescription>Update the class information and schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <ClassForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isPending}
            submitLabel="Update Class"
          />
        </CardContent>
      </Card>
    </div>
  );
}
