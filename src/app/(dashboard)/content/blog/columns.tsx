'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { BlogPost } from '@/types/models';

interface GetBlogColumnsProps {
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onPublish?: (post: BlogPost) => void;
  onUnpublish?: (post: BlogPost) => void;
}

export function getBlogColumns({
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
}: GetBlogColumnsProps): ColumnDef<BlogPost>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div>
          <Link
            href={`/content/blog/${row.original.id}/edit`}
            className="font-medium hover:underline"
          >
            {row.getValue('title')}
          </Link>
          <p className="text-xs text-muted-foreground">/{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return <Badge variant="outline">{type}</Badge>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const category = row.original.category;
        return category ? (
          <Badge variant="secondary">{category.name}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'author',
      header: 'Author',
      cell: ({ row }) => {
        const author = row.original.author;
        return author ? (
          <span>{`${author.first_name} ${author.last_name}`}</span>
        ) : (
          <span className="text-muted-foreground">Unknown</span>
        );
      },
    },
    {
      accessorKey: 'is_published',
      header: 'Status',
      cell: ({ row }) => {
        const isPublished = row.getValue('is_published') as boolean;
        return (
          <Badge variant={isPublished ? 'default' : 'secondary'}>
            {isPublished ? 'Published' : 'Draft'}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        const isPublished = row.getValue(id) as boolean;
        return value.includes(isPublished ? 'published' : 'draft');
      },
    },
    {
      accessorKey: 'view_count',
      header: 'Views',
      cell: ({ row }) => {
        const views = row.getValue('view_count') as number;
        return <div className="flex items-center gap-1"><Eye className="h-3 w-3" />{views}</div>;
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => {
        const createdAt = row.getValue('created_at') as string | null;
        if (!createdAt) return <span className="text-muted-foreground">-</span>;
        return format(new Date(createdAt), 'MMM d, yyyy');
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const post = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(post)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {post.is_published ? (
                onUnpublish && (
                  <DropdownMenuItem onClick={() => onUnpublish(post)}>
                    Unpublish
                  </DropdownMenuItem>
                )
              ) : (
                onPublish && (
                  <DropdownMenuItem onClick={() => onPublish(post)}>
                    Publish
                  </DropdownMenuItem>
                )
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(post)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
