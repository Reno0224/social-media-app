// src/components/features/login-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useLogin } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { FormInput } from "./form-input";

export function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { mutate, isPending } = useLogin();

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((v) => mutate(v))}
      className="flex flex-col gap-xl w-full"
    >
      <FormInput
        control={form.control}
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        className=""
        autoComplete="email"
      />
      <FormInput
        control={form.control}
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        autoComplete="current-password"
      />

      <Button
        type="submit"
        disabled={isPending}
        className="h-13 w-full rounded-full font-semibold mt-5"
      >
        {isPending ? "Loading..." : "Login"}
      </Button>

      <p className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary-200">
          Register
        </Link>
      </p>
    </form>
  );
}
