"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { FormInput } from "./form-input";

export function RegisterForm() {
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useRegister();
  return (
    <form onSubmit={form.handleSubmit((v) => mutate(v))}>
      <FieldGroup>
        <FormInput
          control={form.control}
          name="name"
          label="Name"
          autoComplete="name"
          placeholder="Enter your Name"
        />
        <FormInput
          control={form.control}
          name="username"
          label="Username"
          autoComplete="username"
          placeholder="Enter your username"
        />
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
        />
        <FormInput
          control={form.control}
          name="phone"
          label="Number phone"
          type="tel"
          autoComplete="tel"
          placeholder="Enter your number phone"
        />
        <FormInput
          control={form.control}
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your password"
        />
        <FormInput
          control={form.control}
          name="confirmPassword"
          label="Konfirmasi Password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your confirm password"
        />
      </FieldGroup>

      <Button
        type="submit"
        className="w-full rounded-full h-13 mt-5"
        disabled={isPending}
      >
        {isPending ? "Memproses..." : "Submit"}
      </Button>
      <p className="text-center text-sm mt-4">
        Don&apos;t have an account?{" "}
        <Link href="/login" className="font-medium text-primary-200">
          Log in
        </Link>
      </p>
    </form>
  );
}
