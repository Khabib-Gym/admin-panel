'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ClassForm } from '@/components/forms/class-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateClass } from '@/hooks/queries/use-classes';
import type { CreateClassInput } from '@/lib/api/classes';
import type { ClassFormValues } from '@/lib/validations/class';

export function NewClass() {
  const router = useRouter();
  const { mutate: createClass, isPending } = useCreateClass();

  const handleSubmit = (data: ClassFormValues) => {
    // Convert datetime-local format to ISO format with timezone
    const scheduledAt = new Date(data.scheduled_at).toISOString();

    createClass({ ...data, scheduled_at: scheduledAt } as CreateClassInput, {
      onSuccess: (classItem) => {
        toast.success('Class created successfully');
        router.push(`/classes/${classItem.id}`);
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to create class');
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/classes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Class</h1>
          <p className="text-muted-foreground">Schedule a new class</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
          <CardDescription>Enter the details for the new class</CardDescription>
        </CardHeader>
        <CardContent>
          <ClassForm onSubmit={handleSubmit} isLoading={isPending} submitLabel="Create Class" />
        </CardContent>
      </Card>
    </div>
  );
}
