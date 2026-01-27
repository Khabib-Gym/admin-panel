import { requireRole } from '@/lib/auth/guards';
import { NewAchievementContent } from './new-achievement-content';

export default async function NewAchievementPage() {
  await requireRole('admin', 'super_admin');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Achievement</h1>
        <p className="text-muted-foreground">Add a new achievement to the gamification system</p>
      </div>
      <div className="max-w-2xl">
        <NewAchievementContent />
      </div>
    </div>
  );
}
