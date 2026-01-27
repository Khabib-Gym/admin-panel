'use client';

import { FolderOpen, Pencil, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { BlogCategoryForm } from '@/components/forms/blog-category-form';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useBlogCategories,
  useCreateBlogCategory,
  useDeleteBlogCategory,
  useUpdateBlogCategory,
} from '@/hooks/queries/use-blog';
import type { BlogCategoryFormValues } from '@/lib/validations/blog';
import type { BlogCategory } from '@/types/models';

export function CategoriesList() {
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<BlogCategory | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<BlogCategory | null>(null);

  const { data: categories, isLoading, error } = useBlogCategories();
  const { mutate: createCategory, isPending: isCreating } = useCreateBlogCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateBlogCategory();
  const { mutate: deleteCateg, isPending: isDeleting } = useDeleteBlogCategory();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading categories"
        description={error.message}
        action={{
          label: 'Retry',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  const allCategories = categories ?? [];

  const handleCreate = (data: BlogCategoryFormValues) => {
    createCategory(
      {
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Category created');
          setShowForm(false);
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to create category');
        },
      },
    );
  };

  const handleUpdate = (data: BlogCategoryFormValues) => {
    if (!editCategory) return;

    updateCategory(
      {
        id: editCategory.id,
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success('Category updated');
          setEditCategory(null);
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to update category');
        },
      },
    );
  };

  const handleDelete = () => {
    if (!deleteCategory) return;

    deleteCateg(deleteCategory.id, {
      onSuccess: () => {
        toast.success('Category deleted');
        setDeleteCategory(null);
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete category');
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Categories</h1>
          <p className="text-muted-foreground">Organize your blog posts into categories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/content/blog">Back to Posts</Link>
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      {allCategories.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No categories yet"
          description="Create categories to organize your blog posts."
          action={{
            label: 'Add Category',
            onClick: () => setShowForm(true),
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription className="text-xs">/{category.slug}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditCategory(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteCategory(category)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {category.description && (
                  <p className="mb-3 text-sm text-muted-foreground">{category.description}</p>
                )}
                <Badge variant="secondary">{category.post_count ?? 0} posts</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a new blog category</DialogDescription>
          </DialogHeader>
          <BlogCategoryForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editCategory} onOpenChange={(open) => !open && setEditCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
          </DialogHeader>
          {editCategory && (
            <BlogCategoryForm
              initialData={{
                name: editCategory.name,
                slug: editCategory.slug,
                description: editCategory.description ?? '',
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditCategory(null)}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteCategory}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteCategory?.name}"? Posts in this category will become uncategorized.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
