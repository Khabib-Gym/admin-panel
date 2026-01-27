'use client';

import { format } from 'date-fns';
import { ArrowLeft, Calendar, CheckCircle, Mail, Phone, UserCog, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { PageLoader } from '@/components/shared/loading-spinner';
import { RoleBadge } from '@/components/shared/role-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoleChangeDialog } from '@/components/users/role-change-dialog';
import { UserActivity } from '@/components/users/user-activity';
import { UserMemberships } from '@/components/users/user-memberships';
import { useUser } from '@/hooks/queries/use-users';
import { usePermissions } from '@/hooks/use-permissions';

interface UserDetailsProps {
  userId: string;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return format(date, 'MMM d, yyyy');
  } catch {
    return 'N/A';
  }
}

export function UserDetails({ userId }: UserDetailsProps) {
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const { data: user, isLoading } = useUser(userId);
  const { canManageUsers } = usePermissions();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">User not found</h2>
        <p className="text-muted-foreground mt-2">The user you're looking for doesn't exist.</p>
        <Button asChild className="mt-4">
          <Link href="/users">Back to Users</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/users">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user.profile_image_url}
              alt={`${user.first_name} ${user.last_name}`}
            />
            <AvatarFallback className="text-lg">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {user.first_name} {user.last_name}
              </h1>
              <RoleBadge role={user.role} />
            </div>
            <div className="flex items-center gap-4 mt-1 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              {user.is_verified ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Verified
                </div>
              ) : (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <XCircle className="h-4 w-4" />
                  Unverified
                </div>
              )}
            </div>
          </div>
        </div>
        {canManageUsers && (
          <Button onClick={() => setShowRoleDialog(true)}>
            <UserCog className="mr-2 h-4 w-4" />
            Change Role
          </Button>
        )}
      </div>

      {/* User Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={user.is_active ? 'default' : 'secondary'}>
                {user.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email Verified</span>
              <Badge variant={user.is_verified ? 'default' : 'outline'}>
                {user.is_verified ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Onboarding</span>
              <Badge variant={user.onboarding_completed ? 'default' : 'outline'}>
                {user.onboarding_completed ? 'Completed' : 'Incomplete'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Joined</span>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4" />
                {formatDate(user.created_at)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Full Name</span>
              <span className="text-sm font-medium">
                {user.first_name} {user.last_name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Phone</span>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </div>
              </div>
            )}
            {user.date_of_birth && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Date of Birth</span>
                <span className="text-sm font-medium">{formatDate(user.date_of_birth)}</span>
              </div>
            )}
            {user.gender && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Gender</span>
                <span className="text-sm font-medium capitalize">{user.gender}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Stats */}
      <UserActivity stats={user.stats} />

      {/* Memberships - placeholder since we need the API */}
      <UserMemberships memberships={[]} />

      {/* Role Change Dialog */}
      {showRoleDialog && (
        <RoleChangeDialog user={user} open={showRoleDialog} onOpenChange={setShowRoleDialog} />
      )}
    </div>
  );
}
