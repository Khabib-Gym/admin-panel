'use client';

import { FileText, FolderOpen, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import {
  useBlogPosts,
  useDeleteBlogPost,
  usePublishBlogPost,
  useUnpublishBlogPost,
} from '@/hooks/queries/use-blog';
import type { BlogPost } from '@/types/models';
import { getBlogColumns } from './columns';

export function BlogList() {
  const router = useRouter();
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null);

  const { data, isLoading, error } = useBlogPosts({ published_only: false });
  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteBlogPost();
  const { mutate: publishMutation } = usePublishBlogPost();
  const { mutate: unpublishMutation } = useUnpublishBlogPost();

  const handleEdit = (post: BlogPost) => {
    router.push(`/content/blog/${post.id}/edit`);
  };

  const handleDelete = (post: BlogPost) => {
    setDeletePost(post);
  };

  const handlePublish = (post: BlogPost) => {
    publishMutation(post.id, {
      onSuccess: () => {
        toast.success('Post published');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to publish post');
      },
    });
  };

  const handleUnpublish = (post: BlogPost) => {
    unpublishMutation(post.id, {
      onSuccess: () => {
        toast.success('Post unpublished');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to unpublish post');
      },
    });
  };

  const confirmDelete = () => {
    if (!deletePost) return;

    deleteMutation(deletePost.id, {
      onSuccess: () => {
        toast.success('Post deleted successfully');
        setDeletePost(null);
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete post');
      },
    });
  };

  const columns = getBlogColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onPublish: handlePublish,
    onUnpublish: handleUnpublish,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading posts"
        description={error.message}
        action={{
          label: 'Retry',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  const posts = data?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/content/blog/categories">
              <FolderOpen className="mr-2 h-4 w-4" />
              Categories
            </Link>
          </Button>
          <Button asChild>
            <Link href="/content/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      {posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No blog posts yet"
          description="Get started by creating your first blog post."
          action={{
            label: 'Create Post',
            onClick: () => router.push('/content/blog/new'),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={posts}
          searchKey="title"
          searchPlaceholder="Search posts..."
          filterableColumns={[
            {
              id: 'type',
              title: 'Type',
              options: [
                { label: 'Article', value: 'article' },
                { label: 'Video', value: 'video' },
                { label: 'Quote', value: 'quote' },
              ],
            },
            {
              id: 'is_published',
              title: 'Status',
              options: [
                { label: 'Published', value: 'published' },
                { label: 'Draft', value: 'draft' },
              ],
            },
          ]}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletePost}
        onOpenChange={(open) => !open && setDeletePost(null)}
        title="Delete Post"
        description={`Are you sure you want to delete "${deletePost?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
