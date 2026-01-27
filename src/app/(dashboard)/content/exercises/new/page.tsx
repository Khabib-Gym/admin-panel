import { requireAdmin } from '@/lib/auth/guards';
import { NewExercise } from './new-exercise';

export default async function NewExercisePage() {
  await requireAdmin();

  return <NewExercise />;
}
