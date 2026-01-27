import { requireAdmin } from '@/lib/auth/guards';
import { ExerciseEdit } from './exercise-edit';

interface EditExercisePageProps {
  params: Promise<{ exerciseId: string }>;
}

export default async function EditExercisePage({ params }: EditExercisePageProps) {
  await requireAdmin();
  const { exerciseId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Exercise</h1>
        <p className="text-muted-foreground">Update the exercise details.</p>
      </div>

      <ExerciseEdit exerciseId={exerciseId} />
    </div>
  );
}
