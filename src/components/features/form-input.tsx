// src/components/features/form-input.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  className,
}: FormInputProps<T>) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn("flex flex-col gap-sm", className)}>
          <Label htmlFor={name} className="text-sm font-medium">
            {label}
          </Label>
          <div className="relative">
            <Input
              {...field}
              id={name}
              type={isPassword && show ? "text" : type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              aria-invalid={fieldState.invalid}
              className={cn(
                "h-11 rounded-xl border-neutral-800 bg-neutral-900 px-lg text-sm placeholder:text-neutral-500",
                isPassword && "pr-10",
                fieldState.invalid && "border-accent-red"
              )}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-lg top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            )}
          </div>
          {fieldState.error && (
            <p role="alert" className="text-xs text-accent-red">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}