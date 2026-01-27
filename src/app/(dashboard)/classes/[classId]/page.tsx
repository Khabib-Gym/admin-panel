import { requireCoach } from '@/lib/auth/guards';
import { ClassDetails } from './class-details';

interface ClassDetailsPageProps {
  params: Promise<{ classId: string }>;
}

export default async function ClassDetailsPage({ params }: ClassDetailsPageProps) {
  await requireCoach();
  const { classId } = await params;

  return <ClassDetails classId={classId} />;
}
