import { requireCoach } from '@/lib/auth/guards';
import { WorkoutsList } from './workouts-list';

export default async function WorkoutsPage() {
  await requireCoach();

  return <WorkoutsList />;
}
