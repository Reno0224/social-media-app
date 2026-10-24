import { AuthGuard } from "@/components/features/auth-guard";
import { BottomNav } from "@/components/features/bottom-nav";
import { CreatePostDialog } from "@/components/features/create-post-dialog";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="pb-32">{children}</div>
      <BottomNav />
      <CreatePostDialog />
    </AuthGuard>
  );
}
