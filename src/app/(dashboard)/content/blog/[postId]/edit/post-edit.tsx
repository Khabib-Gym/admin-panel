'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BlogPostForm } from '@/components/forms/blog-post-form';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlogPost, useUpdateBlogPost } from '@/hooks/queries/use-blog';
import type { UpdateBlogPostInput } from '@/lib/api/blog';
import type { BlogPostFormValues } from '@/lib/validations/blog';

interface BlogPostEditProps {
  postId: string;
}

export function BlogPostEdit({ postId }: BlogPostEditProps) {
  const router = useRouter();
  const { data: post, isLoading, error } = useBlogPost(postId);
  const { mutate: updatePost, isPending } = useUpdateBlogPost();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !post) {
    return (
      <EmptyState
        title="Post not found"
        description="The blog post you're looking for doesn't exist."
        action={{
          label: 'Back to Posts',
          onClick: () => router.push('/content/blog'),
        }}
      />
    );
  }

  const handleSubmit = (data: BlogPostFormValues) => {
    const input: UpdateBlogPostInput = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || undefined,
      content: data.content,
      cover_image_url: data.cover_image_url || undefined,
      category_id:
        data.category_id && data.category_id !== '__none__' ? data.category_id : undefined,
      type: data.type,
      is_published: data.is_published,
    };

    updatePost(
      { id: postId, data: input },
      {
        onSuccess: () => {
          toast.success('Blog post updated successfully');
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to update post');
        },
      },
    );
  };

  const initialData: BlogPostFormValues = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? '',
    content: post.content,
    cover_image_url: post.cover_image_url ?? '',
    category_id: post.category_id ?? '__none__',
    type: post.type,
    is_published: post.is_published,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/content/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
          <p className="text-muted-foreground">{post.title}</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
          <CardDescription>Update the blog post details</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogPostForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isPending}
            submitLabel="Update Post"
          />
        </CardContent>
      </Card>
    </div>
  );
}
