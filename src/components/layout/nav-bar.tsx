"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function NavBar() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/home" className="text-xl font-bold">
          twitter-clone
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/home" className="text-sm hover:underline">
            Home
          </Link>
          <Link href="/explore" className="text-sm hover:underline">
            Explore
          </Link>
          <Link href="/activity" className="text-sm hover:underline">
            Activity
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </nav>
      </div>
    </header>
  );
}
