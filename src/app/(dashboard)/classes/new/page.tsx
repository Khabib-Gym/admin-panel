import { requireCoach } from '@/lib/auth/guards';
import { NewClass } from './new-class';

export default async function NewClassPage() {
  await requireCoach();

  return <NewClass />;
}
