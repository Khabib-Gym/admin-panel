import type { PaginatedResponse, PaginationParams, SortParams } from '@/types/api';
import type { BlogCategory, BlogPost } from '@/types/models';
import { apiDelete, apiGet, apiPatch, apiPost, type QueryParams } from './client';

export interface BlogPostListParams extends PaginationParams, SortParams {
  category_id?: string;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
  author_id?: string;
  published_only?: boolean;
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  category_id?: string;
  type?: 'article' | 'video' | 'quote';
  is_published?: boolean;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {}

export interface CreateBlogCategoryInput {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateBlogCategoryInput extends Partial<CreateBlogCategoryInput> {}

export const blogApi = {
  // Posts
  listPosts: (params?: BlogPostListParams) =>
    apiGet<PaginatedResponse<BlogPost>>('/blog/posts', { params: params as QueryParams }),

  getPost: (id: string) => apiGet<BlogPost>(`/blog/posts/${id}`),

  createPost: (data: CreateBlogPostInput) => apiPost<BlogPost>('/blog/posts', data),

  updatePost: (id: string, data: UpdateBlogPostInput) =>
    apiPatch<BlogPost>(`/blog/posts/${id}`, data),

  deletePost: (id: string) => apiDelete<{ message: string }>(`/blog/posts/${id}`),

  publishPost: (id: string) => apiPatch<BlogPost>(`/blog/posts/${id}`, { is_published: true }),

  unpublishPost: (id: string) => apiPatch<BlogPost>(`/blog/posts/${id}`, { is_published: false }),

  // Categories
  listCategories: () => apiGet<BlogCategory[]>('/blog/categories'),

  getCategory: (id: string) => apiGet<BlogCategory>(`/blog/categories/${id}`),

  createCategory: (data: CreateBlogCategoryInput) =>
    apiPost<BlogCategory>('/blog/categories', data),

  updateCategory: (id: string, data: UpdateBlogCategoryInput) =>
    apiPatch<BlogCategory>(`/blog/categories/${id}`, data),

  deleteCategory: (id: string) => apiDelete<{ message: string }>(`/blog/categories/${id}`),
};
