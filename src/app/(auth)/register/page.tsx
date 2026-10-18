import { Suspense } from "react";
import { RegisterForm } from "@/components/features/register-form";
import { AuthCard } from "@/components/features/auth-card";

export default function LoginPage() {
  return (
    <AuthCard title="Register">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}
