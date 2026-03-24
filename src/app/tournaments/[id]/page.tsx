import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TournamentActionButton from "./register-button";
import {
  registerForTournament,
  unregisterFromTournament,
} from "./actions";

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          username: true,
        },
      },
      registrations: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      _count: {
        select: {
          registrations: true,
        },
      },
    },
  });

  if (!tournament) {
    return (
      <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">Tournament not found</h1>
        </div>
      </main>
    );
  }

  let dbUser = null;

  if (userId) {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
  }

  const alreadyRegistered = !!tournament.registrations.find(
    (registration) => registration.userId === dbUser?.id
  );

  const isFull = tournament._count.registrations >= tournament.maxPlayers;

  async function registerAction(formData: FormData) {
    "use server";
    await registerForTournament(formData);
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/tournaments"
          className="mb-6 inline-block text-sm text-zinc-400 hover:text-white"
        >
          ← Back to tournaments
        </Link>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                {tournament.status}
              </span>
              <h1 className="mt-4 text-4xl font-bold">{tournament.title}</h1>
              {tournament.description && (
                <p className="mt-4 max-w-2xl text-zinc-400">
                  {tournament.description}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
              <p>
                <span className="font-medium text-white">Players:</span>{" "}
                {tournament._count.registrations}/{tournament.maxPlayers}
              </p>
              <p className="mt-2">
                <span className="font-medium text-white">Location:</span>{" "}
                {tournament.location || "TBD"}
              </p>
              <p className="mt-2">
                <span className="font-medium text-white">Date:</span>{" "}
                {new Date(tournament.startDate).toLocaleString()}
              </p>
              <p className="mt-2">
                <span className="font-medium text-white">Created by:</span>{" "}
                {tournament.createdBy.username}
              </p>
            </div>
          </div>

          <div className="mt-8">
            {!userId ? (
                <Link
                href="/sign-in"
                className="rounded-xl bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
                >
                Sign in to register
                </Link>
            ) : alreadyRegistered ? (
                <div className="space-y-3">
                <p className="text-green-400">You are already registered.</p>

                <form action={unregisterFromTournament}>
                    <input type="hidden" name="tournamentId" value={tournament.id} />
                    <TournamentActionButton
                        disabled={false}
                        idleText="Drop Tournament"
                        pendingText="Dropping..."
                        variant="danger"
                        confirmMessage="Are you sure? You will be removed from this tournament."
                    />
                </form>
                </div>
            ) : isFull ? (
                <p className="text-red-400">Tournament is full.</p>
            ) : (
                <form action={registerForTournament}>
                <input type="hidden" name="tournamentId" value={tournament.id} />
                <TournamentActionButton
                    disabled={false}
                    idleText="Register"
                    pendingText="Registering..."
                    variant="primary"
                />
                </form>
            )}
            </div>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-2xl font-semibold">Registered Players</h2>

          {tournament.registrations.length === 0 ? (
            <p className="mt-4 text-zinc-400">No registrations yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {tournament.registrations.map((registration, index) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                >
                  <span>
                    {index + 1}. {registration.user.username}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {new Date(registration.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}