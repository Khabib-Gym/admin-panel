import { z } from 'zod';

export const BLOG_POST_TYPES = [
  { value: 'article', label: 'Article' },
  { value: 'video', label: 'Video' },
  { value: 'quote', label: 'Quote' },
] as const;

export const blogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  excerpt: z.string().max(300, 'Excerpt must be less than 300 characters').optional().or(z.literal('')),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  category_id: z.string().optional().or(z.literal('')),
  type: z.enum(['article', 'video', 'quote']),
  is_published: z.boolean(),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export const defaultBlogPostValues: BlogPostFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  category_id: '__none__',
  type: 'article',
  is_published: false,
};

export const blogCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional().or(z.literal('')),
});

export type BlogCategoryFormValues = z.infer<typeof blogCategorySchema>;

export const defaultBlogCategoryValues: BlogCategoryFormValues = {
  name: '',
  slug: '',
  description: '',
};
