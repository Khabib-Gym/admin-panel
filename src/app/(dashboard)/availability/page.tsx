import { requireCoach } from '@/lib/auth/guards';
import { AvailabilityCalendar } from './availability-calendar';

export default async function AvailabilityPage() {
  await requireCoach();

  return <AvailabilityCalendar />;
}
