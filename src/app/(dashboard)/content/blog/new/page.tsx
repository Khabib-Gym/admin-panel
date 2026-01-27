import { requireAdmin } from '@/lib/auth/guards';
import { NewBlogPost } from './new-post';

export default async function NewBlogPostPage() {
  await requireAdmin();

  return <NewBlogPost />;
}
