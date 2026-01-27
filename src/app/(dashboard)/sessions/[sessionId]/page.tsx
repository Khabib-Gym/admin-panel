import { requireCoach } from '@/lib/auth/guards';
import { SessionDetails } from './session-details';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionDetailsPage({ params }: PageProps) {
  await requireCoach();
  const { sessionId } = await params;

  return <SessionDetails sessionId={sessionId} />;
}
