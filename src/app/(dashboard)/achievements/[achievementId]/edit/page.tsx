import { requireAdmin } from '@/lib/auth/guards';
import { AchievementEdit } from './achievement-edit';

interface EditAchievementPageProps {
  params: Promise<{ achievementId: string }>;
}

export default async function EditAchievementPage({ params }: EditAchievementPageProps) {
  await requireAdmin();
  const { achievementId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Achievement</h1>
        <p className="text-muted-foreground">Update the achievement details.</p>
      </div>

      <AchievementEdit achievementId={achievementId} />
    </div>
  );
}
