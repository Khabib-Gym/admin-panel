import { requireAdmin } from '@/lib/auth/guards';
import { BlogPostEdit } from './post-edit';

interface Props {
  params: Promise<{ postId: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  await requireAdmin();
  const { postId } = await params;

  return <BlogPostEdit postId={postId} />;
}
