'use client';

import { Clock, MapPin, Pencil, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AvailabilitySlotForm } from '@/components/forms/availability-slot-form';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMyAvailability, useSetAvailability } from '@/hooks/queries/use-availability';
import { useGyms } from '@/hooks/queries/use-gyms';
import type { AvailabilitySlotFormValues } from '@/lib/validations/availability';
import { DAYS_OF_WEEK, type DayOfWeek } from '@/lib/validations/availability';
import type { CoachAvailability } from '@/types/models';

export function AvailabilityCalendar() {
  const [showForm, setShowForm] = useState(false);
  const [editSlot, setEditSlot] = useState<CoachAvailability | null>(null);
  const [deleteSlot, setDeleteSlot] = useState<CoachAvailability | null>(null);

  const { data: slots, isLoading } = useMyAvailability();
  const { data: gymsData } = useGyms();
  const { mutate: setAvailability, isPending: isSaving } = useSetAvailability();

  const gyms = gymsData?.items ?? [];
  const allSlots = slots ?? [];

  if (isLoading) {
    return <PageLoader />;
  }

  // Group slots by day of week
  const slotsByDay = DAYS_OF_WEEK.map((day) => ({
    ...day,
    slots: allSlots
      .filter((slot) => slot.day_of_week === day.value)
      .sort((a, b) => a.start_time.localeCompare(b.start_time)),
  }));

  const getGymName = (gymId: string) => {
    const gym = gyms.find((g) => g.id === gymId);
    return gym?.name ?? 'Unknown Gym';
  };

  const handleCreate = (data: AvailabilitySlotFormValues) => {
    // Get existing slots for this gym
    const existingSlotsForGym = allSlots
      .filter((s) => s.gym_id === data.gym_id)
      .map((s) => ({
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
        is_recurring: s.is_recurring,
      }));

    // Add the new slot
    const newSlots = [
      ...existingSlotsForGym,
      {
        day_of_week: data.day_of_week,
        start_time: data.start_time,
        end_time: data.end_time,
        is_recurring: data.is_recurring ?? true,
      },
    ];

    setAvailability(
      {
        gym_id: data.gym_id,
        slots: newSlots,
      },
      {
        onSuccess: () => {
          toast.success('Availability slot added');
          setShowForm(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to add slot');
        },
      },
    );
  };

  const handleUpdate = (data: AvailabilitySlotFormValues) => {
    if (!editSlot) return;

    // If gym changed, we need to handle two gyms
    if (editSlot.gym_id !== data.gym_id) {
      // Remove from old gym
      const oldGymSlots = allSlots
        .filter((s) => s.gym_id === editSlot.gym_id && s.id !== editSlot.id)
        .map((s) => ({
          day_of_week: s.day_of_week,
          start_time: s.start_time,
          end_time: s.end_time,
          is_recurring: s.is_recurring,
        }));

      // Add to new gym
      const newGymSlots = [
        ...allSlots
          .filter((s) => s.gym_id === data.gym_id)
          .map((s) => ({
            day_of_week: s.day_of_week,
            start_time: s.start_time,
            end_time: s.end_time,
            is_recurring: s.is_recurring,
          })),
        {
          day_of_week: data.day_of_week,
          start_time: data.start_time,
          end_time: data.end_time,
          is_recurring: data.is_recurring ?? true,
        },
      ];

      // Update old gym first, then new gym
      setAvailability(
        { gym_id: editSlot.gym_id, slots: oldGymSlots },
        {
          onSuccess: () => {
            setAvailability(
              { gym_id: data.gym_id, slots: newGymSlots },
              {
                onSuccess: () => {
                  toast.success('Availability slot updated');
                  setEditSlot(null);
                },
                onError: (error) => {
                  toast.error(error.message || 'Failed to update slot');
                },
              },
            );
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to update slot');
          },
        },
      );
    } else {
      // Same gym - replace the slot
      const slotsForGym = allSlots
        .filter((s) => s.gym_id === data.gym_id)
        .map((s) =>
          s.id === editSlot.id
            ? {
                day_of_week: data.day_of_week,
                start_time: data.start_time,
                end_time: data.end_time,
                is_recurring: data.is_recurring ?? true,
              }
            : {
                day_of_week: s.day_of_week,
                start_time: s.start_time,
                end_time: s.end_time,
                is_recurring: s.is_recurring,
              },
        );

      setAvailability(
        { gym_id: data.gym_id, slots: slotsForGym },
        {
          onSuccess: () => {
            toast.success('Availability slot updated');
            setEditSlot(null);
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to update slot');
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (!deleteSlot) return;

    // Get remaining slots for this gym (excluding the one being deleted)
    const remainingSlots = allSlots
      .filter((s) => s.gym_id === deleteSlot.gym_id && s.id !== deleteSlot.id)
      .map((s) => ({
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
        is_recurring: s.is_recurring,
      }));

    // Set remaining slots (empty array will clear all for this gym)
    setAvailability(
      { gym_id: deleteSlot.gym_id, slots: remainingSlots },
      {
        onSuccess: () => {
          toast.success('Availability slot removed');
          setDeleteSlot(null);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to remove slot');
        },
      },
    );
  };

  const formatTime = (time: string) => {
    const parts = time.split(':');
    const hours = parts[0] ?? '0';
    const minutes = parts[1] ?? '00';
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Availability</h1>
          <p className="text-muted-foreground">
            Manage your weekly availability for private sessions
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} type="button">
          <Plus className="mr-2 h-4 w-4" />
          Add Slot
        </Button>
      </div>

      {/* Weekly Calendar */}
      <div className="grid gap-4 md:grid-cols-7">
        {slotsByDay.map((day) => (
          <Card key={day.value}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{day.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {day.slots.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No availability</p>
              ) : (
                day.slots.map((slot) => (
                  <div key={slot.id} className="p-2 bg-muted rounded-md text-xs group relative">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{getGymName(slot.gym_id)}</span>
                    </div>
                    {slot.is_recurring && (
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        Weekly
                      </Badge>
                    )}
                    <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5"
                        onClick={() => setEditSlot(slot)}
                        type="button"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 text-destructive"
                        onClick={() => setDeleteSlot(slot)}
                        type="button"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {allSlots.length === 0 && (
        <EmptyState
          icon={Clock}
          title="No availability set"
          description="Add your available time slots so members can book private sessions with you."
          action={{
            label: 'Add First Slot',
            onClick: () => setShowForm(true),
          }}
        />
      )}

      {/* Add Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Availability Slot</DialogTitle>
            <DialogDescription>Set when you're available for private sessions</DialogDescription>
          </DialogHeader>
          <AvailabilitySlotForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            isLoading={isSaving}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editSlot} onOpenChange={(open) => !open && setEditSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Availability Slot</DialogTitle>
            <DialogDescription>Update your availability</DialogDescription>
          </DialogHeader>
          {editSlot && (
            <AvailabilitySlotForm
              initialData={{
                gym_id: editSlot.gym_id,
                day_of_week: editSlot.day_of_week as DayOfWeek,
                start_time: editSlot.start_time,
                end_time: editSlot.end_time,
                is_recurring: editSlot.is_recurring,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditSlot(null)}
              isLoading={isSaving}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteSlot}
        onOpenChange={(open) => !open && setDeleteSlot(null)}
        title="Remove Availability"
        description="Are you sure you want to remove this availability slot?"
        confirmLabel="Remove"
        variant="destructive"
        isLoading={isSaving}
        onConfirm={handleDelete}
      />
    </div>
  );
}
