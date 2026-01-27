'use client';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { CreateMembershipDialog } from '@/components/memberships/create-membership-dialog';
import { MembershipActions } from '@/components/memberships/membership-actions';
import { MembershipEditDialog } from '@/components/memberships/membership-edit-dialog';
import { MembershipStatusBadge } from '@/components/shared/membership-status-badge';
import { MembershipTypeBadge } from '@/components/shared/membership-type-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMemberships } from '@/hooks/queries/use-memberships';
import type { Membership, MembershipStatusValue } from '@/types/models';

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'N/A';
  try {
    return format(new Date(dateStr), 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
}

function MembershipRow({ membership, onEdit }: { membership: Membership; onEdit: () => void }) {
  const userName = membership.user
    ? `${membership.user.first_name} ${membership.user.last_name}`
    : 'Unknown User';
  const userEmail = membership.user?.email || '';
  const gymName = membership.gym?.name || 'Unknown Gym';
  const gymCity = membership.gym?.city || '';

  return (
    <TableRow>
      <TableCell>
        <div>
          <p className="font-medium">{userName}</p>
          <p className="text-sm text-muted-foreground">{userEmail}</p>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium">{gymName}</p>
          {gymCity && <p className="text-sm text-muted-foreground">{gymCity}</p>}
        </div>
      </TableCell>
      <TableCell>
        <MembershipTypeBadge type={membership.type} />
      </TableCell>
      <TableCell>
        <MembershipStatusBadge status={membership.status} />
      </TableCell>
      <TableCell className="text-sm">{formatDate(membership.expires_at)}</TableCell>
      <TableCell>
        <MembershipActions membership={membership} onEdit={onEdit} />
      </TableCell>
    </TableRow>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Gym</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
      <Users className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">No memberships found</h3>
      <p className="mt-2 text-sm text-muted-foreground text-center">
        No memberships match your current filters.
      </p>
    </div>
  );
}

export function MembershipsList() {
  const [statusFilter, setStatusFilter] = useState<MembershipStatusValue | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const pageSize = 10;

  const { data, isLoading, error } = useMemberships({
    page,
    page_size: pageSize,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchQuery || undefined,
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Failed to load memberships: {error.message}
      </div>
    );
  }

  const memberships = data?.items || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.total_pages || 1;
  const totalCount = pagination?.total_count || 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-64 pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as MembershipStatusValue | 'all');
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {totalCount} membership{totalCount !== 1 ? 's' : ''}
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Membership
          </Button>
        </div>
      </div>

      {memberships.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Gym</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberships.map((membership) => (
                  <MembershipRow
                    key={membership.id}
                    membership={membership}
                    onEdit={() => setEditingMembership(membership)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <MembershipEditDialog
        membership={editingMembership}
        open={editingMembership !== null}
        onOpenChange={(open) => {
          if (!open) setEditingMembership(null);
        }}
      />

      <CreateMembershipDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  );
}
