import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";

export default async function Navbar() {
  const { userId } = await auth();

  let dbUser: {
    username: string | null;
    role: string;
  } | null = null;

  if (userId) {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        username: true,
        role: true,
      },
    });
  }

  const isAdmin = dbUser?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-sky-400/40 bg-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.18)]">
            <div className="absolute inset-1 rounded-full border border-amber-300/30 animate-[spinSlow_10s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-sky-400/20 animate-[spinSlow_6s_linear_infinite_reverse]" />
            <div className="h-3 w-3 rounded-full bg-sky-300 blur-[0.5px]" />
          </div>

          <div>
            <p className="text-base font-extrabold tracking-tight text-white transition group-hover:text-sky-300">
              Beyblade X League
            </p>
            <p className="text-xs text-slate-400"> Build. Spin. Battle.</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/tournaments"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-300"
          >
            Tournaments
          </Link>

          <Link
            href="/builds"
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-300"
          >
            Builds
          </Link>

          {dbUser ? (
            <Link
              href="/dashboard"
              className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-sm font-semibold text-amber-200 transition hover:border-amber-300/40 hover:bg-amber-300/15"
            >
              {dbUser.username || "Player"}
            </Link>
          ) : null}

          {isAdmin ? (
            <Link
              href="/admin/tournaments/create"
              className="rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-4 py-2 text-sm font-extrabold text-slate-950 shadow-[0_8px_24px_rgba(251,191,36,0.28)] transition hover:-translate-y-0.5"
            >
              Admin
            </Link>
          ) : null}

          <div className="ml-1">
            {userId ? (
              <UserButton />
            ) : (
              <Link
                href="/sign-in"
                className="rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-4 py-2 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}