export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark auth-glow flex min-h-screen items-center justify-center px-xl py-9xl text-foreground">
      {children}
    </div>
  );
}
