// src/components/features/edit-profile-dialog.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateMe } from "@/hooks/use-me";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/profile";
import { validateImageFile } from "@/lib/validations/post";
import type { Profile } from "@/types/api";
import { cn } from "@/lib/utils";
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
import { UserAvatar } from "./user-avatar";
import { compressImage } from "@/lib/image";

interface EditProfileFormProps {
  profile: Profile;
  onDone: () => void;
  className?: string;
  inputClassName?: string;
  submitClassName?: string;
}

function EditProfileForm({
  profile,
  onDone,
  className,
  inputClassName,
  submitClassName,
}: EditProfileFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<{ file: File; url: string } | null>(
    null,
  );
  const [fileError, setFileError] = useState<string | null>(null);

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

  // lepaskan URL pratinjau saat diganti atau saat form ditutup
  useEffect(() => {
    return () => {
      if (avatar) URL.revokeObjectURL(avatar.url);
    };
  }, [avatar]);

  async function pickFile(file: File | undefined) {
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      setFileError(error);
      return;
    }
    setFileError(null);
    const small = await compressImage(file, { maxSide: 512 }); // foto profil cukup kecil
    setAvatar({ file: small, url: URL.createObjectURL(small) });
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((v) =>
        mutate(
          { input: v, avatar: avatar?.file ?? null },
          { onSuccess: onDone },
        ),
      )}
      className={cn("flex flex-col gap-xl", className)}
    >
      <div className="flex items-center gap-xl">
        <UserAvatar
          name={profile.name}
          avatarUrl={avatar?.url ?? profile.avatarUrl}
          className="size-20 text-xl"
        />
        <div className="space-y-xs">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            className="h-9 rounded-full border-neutral-800 bg-transparent px-xl text-sm font-semibold dark:bg-transparent"
          >
            Change photo
          </Button>
          <p className="text-xs text-neutral-400">
            PNG, JPG, or WEBP up to 5 MB
          </p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          aria-label="Choose profile photo"
          className="sr-only"
          onChange={(e) => {
            pickFile(e.target.files?.[0]);
            e.target.value = ""; // izinkan memilih file yang sama lagi
          }}
        />
      </div>
      {fileError && (
        <p role="alert" className="-mt-md text-xs text-accent-red">
          {fileError}
        </p>
      )}

      <FormInput
        control={form.control}
        name="name"
        label="Name"
        inputClassName={inputClassName}
      />
      <FormInput
        control={form.control}
        name="username"
        label="Username"
        inputClassName={inputClassName}
      />
      <FormInput
        control={form.control}
        name="phone"
        label="Phone"
        type="tel"
        inputClassName={inputClassName}
      />

      <Controller
        name="bio"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-sm">
            <Label htmlFor="bio" className="text-sm font-medium">
              Bio
            </Label>
            <Textarea
              {...field}
              id="bio"
              rows={3}
              aria-invalid={fieldState.invalid}
              className={cn(
                "rounded-xl border-neutral-800 bg-neutral-950 text-sm dark:bg-neutral-950",
                fieldState.invalid && "border-accent-red",
                inputClassName,
              )}
            />
            {fieldState.error && (
              <p role="alert" className="text-xs text-accent-red">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      <Button
        type="submit"
        disabled={isPending}
        className={cn(
          "h-11 rounded-full bg-primary-300 font-semibold text-white hover:bg-primary-200",
          submitClassName,
        )}
      >
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
          aria-describedby={undefined}
          style={{ width: "min(440px, calc(100vw - 2rem))", maxWidth: "none" }}
          className={cn(
            "max-h-[92dvh] gap-3xl overflow-y-auto rounded-2xl border-neutral-800 bg-neutral-950 p-3xl text-neutral-50",
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
