import { requireAdmin } from '@/lib/auth/guards';
import { ExercisesList } from './exercises-list';

export default async function ExercisesPage() {
  await requireAdmin();

  return <ExercisesList />;
}
