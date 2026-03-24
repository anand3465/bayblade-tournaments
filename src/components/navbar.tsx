import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function Navbar() {
  const { userId } = await auth();

  let isAdmin = false;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    isAdmin = user?.role === "ADMIN";
  }

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-bold text-lg">
          Beyblade
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/tournaments">Tournaments</Link>
          <Link href="/builds">Builds</Link>

          {userId && <Link href="/dashboard">Dashboard</Link>}
          {userId && <Link href="/dashboard/builds">My Builds</Link>}

          {isAdmin && (
            <Link href="/admin/tournaments/create">
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}