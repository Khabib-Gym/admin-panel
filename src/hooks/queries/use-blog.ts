'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type BlogPostListParams,
  blogApi,
  type CreateBlogCategoryInput,
  type CreateBlogPostInput,
  type UpdateBlogCategoryInput,
  type UpdateBlogPostInput,
} from '@/lib/api/blog';
import { queryKeys } from '@/lib/query/keys';

// Posts
export function useBlogPosts(params?: BlogPostListParams) {
  return useQuery({
    queryKey: [...queryKeys.content.blog.posts(), params ?? {}],
    queryFn: () => blogApi.listPosts(params),
  });
}

export function useBlogPost(id: string) {
  return useQuery({
    queryKey: queryKeys.content.blog.post(id),
    queryFn: () => blogApi.getPost(id),
    enabled: !!id,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlogPostInput) => blogApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.blog.all });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogPostInput }) =>
      blogApi.updatePost(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.blog.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.blog.post(id) });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.blog.all });
    },
  });
}

export function usePublishBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogApi.publishPost(id),
    onSuccess: () => {
      // Invalidate and refetch all blog queries to ensure UI is updated
      queryClient.invalidateQueries({
        queryKey: queryKeys.content.blog.all,
        refetchType: 'all',
      });
    },
  });
}

export function useUnpublishBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogApi.unpublishPost(id),
    onSuccess: () => {
      // Invalidate and refetch all blog queries to ensure UI is updated
      queryClient.invalidateQueries({
        queryKey: queryKeys.content.blog.all,
        refetchType: 'all',
      });
    },
  });
}

// Categories
export function useBlogCategories() {
  return useQuery({
    queryKey: queryKeys.content.blog.categories(),
    queryFn: () => blogApi.listCategories(),
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlogCategoryInput) => blogApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.blog.categories() });
    },
  });
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogCategoryInput }) =>
      blogApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.blog.categories() });
    },
  });
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.blog.categories() });
    },
  });
}
