import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { requireRole } from '@/lib/auth/guards';
import { AchievementsList } from './achievements-list';

export default async function AchievementsPage() {
  await requireRole('admin', 'super_admin');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground">
            Manage badges and achievements for the gamification system
          </p>
        </div>
        <Link href="/achievements/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Achievement
          </Button>
        </Link>
      </div>
      <AchievementsList />
    </div>
  );
}
