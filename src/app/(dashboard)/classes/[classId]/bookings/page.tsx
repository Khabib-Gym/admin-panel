import { requireCoach } from '@/lib/auth/guards';
import { ClassBookings } from './class-bookings';

interface ClassBookingsPageProps {
  params: Promise<{ classId: string }>;
}

export default async function ClassBookingsPage({ params }: ClassBookingsPageProps) {
  await requireCoach();
  const { classId } = await params;

  return <ClassBookings classId={classId} />;
}
