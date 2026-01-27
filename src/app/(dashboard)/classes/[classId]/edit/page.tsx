import { requireCoach } from '@/lib/auth/guards';
import { ClassEdit } from './class-edit';

interface ClassEditPageProps {
  params: Promise<{ classId: string }>;
}

export default async function ClassEditPage({ params }: ClassEditPageProps) {
  await requireCoach();
  const { classId } = await params;

  return <ClassEdit classId={classId} />;
}
