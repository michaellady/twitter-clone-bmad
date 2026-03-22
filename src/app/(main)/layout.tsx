import { NavBar } from "@/components/layout/nav-bar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl border-x min-h-screen">
        <NavBar />
        <main>{children}</main>
      </div>
    </div>
  );
}
