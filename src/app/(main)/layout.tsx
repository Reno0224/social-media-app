import { Navbar } from "@/components/features/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="mx-auto w-full bg-black px-xl py-3xl">{children}</div>
    </>
  );
}
