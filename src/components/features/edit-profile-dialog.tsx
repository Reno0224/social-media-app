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
import { cn } from "@/lib/utils";

interface EditProfileFormProps {
  profile: Profile;
  onDone: () => void;
  className?: string; // <form>
  inputClassName?: string; // semua Input dan Textarea
  submitClassName?: string; // tombol simpan
}
function EditProfileForm({
  profile,
  onDone,
  className,
  inputClassName,
  submitClassName,
}: EditProfileFormProps) {
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

interface EditProfileDialogProps {
  profile: Profile;
  className?: string;
  contentClassName?: string;
  formClassName?: string;
  inputClassName?: string;
  submitClassName?: string;
}

export function EditProfileDialog({
  profile,
  className,
  contentClassName,
  formClassName,
  inputClassName,
  submitClassName,
}: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn("rounded-full", className)}
        onClick={() => setOpen(true)}
      >
        Edit Profile
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "gap-3xl rounded-2xl border-neutral-800 bg-neutral-950 p-3xl sm:max-w-[440px]",
            contentClassName,
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <EditProfileForm
            profile={profile}
            onDone={() => setOpen(false)}
            className={formClassName}
            inputClassName={inputClassName}
            submitClassName={submitClassName}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
