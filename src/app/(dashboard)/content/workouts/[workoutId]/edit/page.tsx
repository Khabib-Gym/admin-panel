import { requireCoach } from '@/lib/auth/guards';
import { WorkoutEdit } from './workout-edit';

interface EditWorkoutPageProps {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  await requireCoach();
  const { workoutId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Workout Template</h1>
        <p className="text-muted-foreground">Update the workout template details and exercises.</p>
      </div>

      <WorkoutEdit workoutId={workoutId} />
    </div>
  );
}
