'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BlogPostForm } from '@/components/forms/blog-post-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateBlogPost } from '@/hooks/queries/use-blog';
import type { CreateBlogPostInput } from '@/lib/api/blog';
import type { BlogPostFormValues } from '@/lib/validations/blog';

export function NewBlogPost() {
  const router = useRouter();
  const { mutate: createPost, isPending } = useCreateBlogPost();

  const handleSubmit = (data: BlogPostFormValues) => {
    const input: CreateBlogPostInput = {
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

    createPost(input, {
      onSuccess: (post) => {
        toast.success('Blog post created successfully');
        router.push(`/content/blog/${post.id}/edit`);
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to create post');
      },
    });
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
          <h1 className="text-3xl font-bold tracking-tight">Create Blog Post</h1>
          <p className="text-muted-foreground">Write a new blog post</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
          <CardDescription>Enter the details for your new blog post</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogPostForm onSubmit={handleSubmit} isLoading={isPending} submitLabel="Create Post" />
        </CardContent>
      </Card>
    </div>
  );
}
