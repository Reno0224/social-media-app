// src/components/features/edit-profile-dialog.tsx
"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateMe } from "@/hooks/use-me";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/profile";
import type { Profile } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormInput } from "./form-input";

function EditProfileForm({
  profile,
  onDone,
}: {
  profile: Profile;
  onDone: () => void;
}) {
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profile.name,
      username: profile.username,
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
    },
  });
  const { mutate, isPending } = useUpdateMe();

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((v) => mutate(v, { onSuccess: onDone }))}
      className="flex flex-col gap-xl"
    >
      <FormInput control={form.control} name="name" label="Name" />
      <FormInput control={form.control} name="username" label="Username" />
      <FormInput control={form.control} name="phone" label="Phone" type="tel" />

      <Controller
        name="bio"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-sm">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              {...field}
              id="bio"
              rows={3}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error && (
              <p role="alert" className="text-xs text-accent-red">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      <Button type="submit" disabled={isPending} className="rounded-full">
        {isPending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}

export function EditProfileDialog({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => setOpen(true)}
      >
        Edit profile
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          <EditProfileForm profile={profile} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
