'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateUserRole } from '@/hooks/queries/use-users';
import { usePermissions } from '@/hooks/use-permissions';
import type { User } from '@/types/models';

interface RoleChangeDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Role = 'member' | 'coach' | 'admin' | 'super_admin';

const roleOptions: { value: Role; label: string; description: string }[] = [
  { value: 'member', label: 'Member', description: 'Basic access to the mobile app' },
  { value: 'coach', label: 'Coach', description: 'Can manage classes and sessions' },
  { value: 'admin', label: 'Admin', description: 'Can manage gyms, users, and content' },
  { value: 'super_admin', label: 'Super Admin', description: 'Full system access' },
];

export function RoleChangeDialog({ user, open, onOpenChange }: RoleChangeDialogProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(user.role);
  const { isSuperAdmin, isAdmin } = usePermissions();
  const { mutate: updateRole, isPending } = useUpdateUserRole();

  // Filter available roles based on current user's permissions
  const availableRoles = roleOptions.filter((role) => {
    if (isSuperAdmin) return true;
    // Admins can only set member or coach
    if (isAdmin) return ['member', 'coach'].includes(role.value);
    return false;
  });

  const isDowngrade =
    roleOptions.findIndex((r) => r.value === selectedRole) <
    roleOptions.findIndex((r) => r.value === user.role);

  const handleSubmit = () => {
    if (selectedRole === user.role) {
      onOpenChange(false);
      return;
    }

    updateRole(
      { id: user.id, new_role: selectedRole },
      {
        onSuccess: () => {
          toast.success(
            `Role updated to ${roleOptions.find((r) => r.value === selectedRole)?.label}`,
          );
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update role');
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Change the role for {user.first_name} {user.last_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <span className="text-sm font-medium">Current Role</span>
            <div className="text-sm text-muted-foreground">
              {roleOptions.find((r) => r.value === user.role)?.label}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">New Role</span>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <div>
                      <div className="font-medium">{role.label}</div>
                      <div className="text-xs text-muted-foreground">{role.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isDowngrade && selectedRole !== user.role && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Downgrading this user's role will remove their access to certain features.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || selectedRole === user.role}
            type="button"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
