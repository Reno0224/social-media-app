import { Suspense } from "react";
import { LoginForm } from "@/components/features/login-form";
import { AuthCard } from "@/components/features/auth-card";

export default function LoginPage() {
  return (
   <AuthCard title="Welcome Back!">
    <Suspense>
      <LoginForm/>
    </Suspense>
   </AuthCard>
  );
}
