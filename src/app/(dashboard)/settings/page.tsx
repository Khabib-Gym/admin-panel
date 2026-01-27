import { requireAuth } from '@/lib/auth/guards';
import { SettingsContent } from './settings-content';

export default async function SettingsPage() {
  await requireAuth();

  return <SettingsContent />;
}
