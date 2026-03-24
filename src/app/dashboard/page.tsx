import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      registrations: {
        include: {
          tournament: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      tournaments: {
        orderBy: {
          startDate: "asc",
        },
      },
    },
  });

  if (!dbUser) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-10">

        {/* 👤 USER INFO */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-zinc-400">
            Welcome back, {dbUser.username}
          </p>

          <div className="mt-4 text-sm text-zinc-300 space-y-1">
            <p><span className="text-white font-medium">Email:</span> {dbUser.email}</p>
            <p><span className="text-white font-medium">Role:</span> {dbUser.role}</p>
          </div>
        </div>

        {/* 🏆 MY REGISTRATIONS */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-2xl font-semibold">My Tournaments</h2>

          {dbUser.registrations.length === 0 ? (
            <p className="mt-4 text-zinc-400">
              You have not registered for any tournaments.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {dbUser.registrations.map((registration) => (
                <Link
                  key={registration.id}
                  href={`/tournaments/${registration.tournament.id}`}
                  className="block rounded-xl border border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-800"
                >
                  <h3 className="text-lg font-semibold">
                    {registration.tournament.title}
                  </h3>

                  <p className="text-sm text-zinc-400">
                    {new Date(
                      registration.tournament.startDate
                    ).toLocaleString()}
                  </p>

                  <p className="text-sm text-zinc-500">
                    Location: {registration.tournament.location || "TBD"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 🛠️ ADMIN SECTION */}
        {dbUser.role === "ADMIN" && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">My Created Tournaments</h2>

              <Link
                href="/admin/tournaments/create"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
              >
                + Create
              </Link>
            </div>

            {dbUser.tournaments.length === 0 ? (
              <p className="mt-4 text-zinc-400">
                You haven't created any tournaments.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {dbUser.tournaments.map((tournament) => (
                  <Link
                    key={tournament.id}
                    href={`/tournaments/${tournament.id}`}
                    className="block rounded-xl border border-zinc-800 bg-zinc-950 p-4 hover:bg-zinc-800"
                  >
                    <h3 className="text-lg font-semibold">
                      {tournament.title}
                    </h3>

                    <p className="text-sm text-zinc-400">
                      {new Date(tournament.startDate).toLocaleString()}
                    </p>

                    <p className="text-sm text-zinc-500">
                      Max Players: {tournament.maxPlayers}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}