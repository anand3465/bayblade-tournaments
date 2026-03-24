import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type TournamentWithCounts = Prisma.TournamentGetPayload<{
  include: {
    _count: {
      select: {
        registrations: true;
      };
    };
    createdBy: {
      select: {
        username: true;
      };
    };
  };
}>;

export default async function TournamentsPage() {
  const tournaments: TournamentWithCounts[] = await prisma.tournament.findMany({
    orderBy: {
      startDate: "asc",
    },
    include: {
      _count: {
        select: {
          registrations: true,
        },
      },
      createdBy: {
        select: {
          username: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Tournaments</h1>
            <p className="mt-2 text-zinc-400">
              Browse upcoming Beyblade events and register.
            </p>
          </div>

          <Link
            href="/admin/tournaments/create"
            className="rounded-xl bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
          >
            Create Tournament
          </Link>
        </div>

        {tournaments.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-400">
            No tournaments yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tournaments.map((tournament) => {
              const spotsLeft =
                tournament.maxPlayers - tournament._count.registrations;

              return (
                <Link
                  key={tournament.id}
                  href={`/tournaments/${tournament.id}`}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700 hover:bg-zinc-800"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                      {tournament.status}
                    </span>
                    <span className="text-sm text-zinc-400">
                      {tournament._count.registrations}/{tournament.maxPlayers} players
                    </span>
                  </div>

                  <h2 className="text-2xl font-semibold">{tournament.title}</h2>

                  {tournament.description && (
                    <p className="mt-3 line-clamp-3 text-sm text-zinc-400">
                      {tournament.description}
                    </p>
                  )}

                  <div className="mt-5 space-y-2 text-sm text-zinc-300">
                    <p>
                      <span className="font-medium text-white">Location:</span>{" "}
                      {tournament.location || "TBD"}
                    </p>
                    <p>
                      <span className="font-medium text-white">Date:</span>{" "}
                      {new Date(tournament.startDate).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium text-white">Created by:</span>{" "}
                      {tournament.createdBy.username}
                    </p>
                    <p>
                        <span className="font-medium text-white">Spots left:</span>{" "}
                        {spotsLeft === 0 ? (
                            <span className="text-red-400 text-xs">FULL</span>
                        ) : (
                            spotsLeft
                        )}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}