import { requireCoach } from '@/lib/auth/guards';
import { NewWorkout } from './new-workout';

export default async function NewWorkoutPage() {
  await requireCoach();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Workout Template</h1>
        <p className="text-muted-foreground">Build a new workout template with exercises.</p>
      </div>

      <NewWorkout />
    </div>
  );
}
