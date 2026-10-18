import { AuthGuard } from "@/components/features/auth-guard";

export default function Privatelayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard> {children}</AuthGuard>;
}
