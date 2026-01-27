import { requireCoach } from '@/lib/auth/guards';
import { ClassList } from './class-list';

export default async function ClassesPage() {
  await requireCoach();

  return <ClassList />;
}
