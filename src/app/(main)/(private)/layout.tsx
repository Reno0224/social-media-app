import { AuthGuard } from "@/components/features/auth-guard";
import { BottomNav } from "@/components/features/bottom-nav";

export default function Privatelayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="pb-32"> {children}</div>
      <BottomNav/>
    </AuthGuard>
  )
}
