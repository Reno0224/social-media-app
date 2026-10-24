import Image from "next/image";

interface AuthCardProps {
  title: string;
  children: React.ReactNode;
}

export function AuthCard({ title, children }: AuthCardProps) {
  return (
    <main className="w-full max-w-[446px] rounded-2xl border border-neutral-900 bg-black/80 px-4 py-8 md:px-6 md:py-10 shadow-2xl backdrop-blur-md">
      <header className="mb-3xl flex flex-col items-center gap-3xl text-center">
        <div className="flex items-center gap-md">
          <Image
            src="/icon/logo.svg"
            alt="Sociality-logo"
            width={137}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </div>
        <h1 className="text-display-sm font-bold">{title}</h1>
      </header>
      {children}
    </main>
  );
}
