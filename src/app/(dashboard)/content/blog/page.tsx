import { requireAdmin } from '@/lib/auth/guards';
import { BlogList } from './blog-list';

export default async function BlogPostsPage() {
  await requireAdmin();

  return <BlogList />;
}
