'use client';

import { Award, DollarSign, Star } from 'lucide-react';
import { toast } from 'sonner';
import { CoachProfileForm } from '@/components/forms/coach-profile-form';
import { PageLoader } from '@/components/shared/loading-spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCoachProfile, useUpdateCoachProfile } from '@/hooks/queries/use-coach';
import type { CoachProfileFormValues } from '@/lib/validations/coach';

export function ProfileContent() {
  const { data: profile, isLoading } = useCoachProfile();
  const { mutate: updateProfile, isPending } = useUpdateCoachProfile();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const handleSubmit = (data: CoachProfileFormValues) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update profile');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your coach profile and settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.user?.profile_image_url} />
                <AvatarFallback className="text-2xl">
                  {profile.user?.first_name?.[0]}
                  {profile.user?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-lg font-semibold">
                {profile.user?.first_name} {profile.user?.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">{profile.user?.email}</p>
              {profile.has_creator_badge && (
                <Badge className="mt-2 gap-1">
                  <Award className="h-3 w-3" />
                  Creator
                </Badge>
              )}
            </div>

            <Separator />

            {profile.rating_average && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{profile.rating_average.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  ({profile.rating_count} reviews)
                </span>
              </div>
            )}

            {profile.hourly_rate && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>${profile.hourly_rate}/hour</span>
              </div>
            )}

            {profile.years_experience && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span>{profile.years_experience} years experience</span>
              </div>
            )}

            {profile.specializations && profile.specializations.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Specializations</p>
                <div className="flex flex-wrap gap-1">
                  {profile.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.certifications && profile.certifications.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Certifications</p>
                <div className="flex flex-wrap gap-1">
                  {profile.certifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Badge variant={profile.is_accepting_clients ? 'default' : 'secondary'}>
              {profile.is_accepting_clients ? 'Accepting Clients' : 'Not Accepting Clients'}
            </Badge>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <CoachProfileForm
              initialData={{
                bio: profile.bio ?? undefined,
                specializations: profile.specializations ?? [],
                certifications: profile.certifications ?? [],
                hourly_rate: profile.hourly_rate ?? undefined,
                is_accepting_clients: profile.is_accepting_clients,
              }}
              onSubmit={handleSubmit}
              isLoading={isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
