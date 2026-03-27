import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import GlassCard from "@/components/ui/GlassCard";
import BeyButton from "@/components/ui/BeyButton";
import TournamentHero from "@/components/tournaments/TournamentHero";
import { registerForTournament, unregisterFromTournament } from "./actions";

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
      <PageShell>
        <GlassCard className="p-8">
          <h1 className="text-3xl font-bold text-white">Tournament not found</h1>
          <p className="mt-3 text-slate-400">
            The event you tried to open does not exist.
          </p>
          <div className="mt-5">
            <Link
              href="/tournaments"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-300"
            >
              Back to tournaments
            </Link>
          </div>
        </GlassCard>
      </PageShell>
    );
  }

  let dbUser: { id: string; username: string | null } | null = null;

  if (userId) {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        username: true,
      },
    });
  }

  const alreadyRegistered = !!tournament.registrations.find(
    (registration) => registration.userId === dbUser?.id
  );

  const isFull = tournament._count.registrations >= tournament.maxPlayers;

  return (
    <PageShell>
      <div className="space-y-8">
        <Link
          href="/tournaments"
          className="inline-flex text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to tournaments
        </Link>

        <TournamentHero
          title={tournament.title}
          description={tournament.description}
          location={tournament.location}
          startDate={tournament.startDate}
          status={tournament.status}
          registrationsCount={tournament._count.registrations}
          maxPlayers={tournament.maxPlayers}
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard strong className="p-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300/80">
              Registration
            </p>

            <h2 className="mt-3 text-2xl font-extrabold text-white">
              {alreadyRegistered ? "You are registered" : "Join this tournament"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {alreadyRegistered
                ? "You can drop from this event if your plans changed."
                : isFull
                ? "This tournament is currently full."
                : "Secure your place in the bracket and get ready to battle."}
            </p>

            <div className="mt-5">
              {!userId ? (
                <BeyButton href="/sign-in">Sign In to Register</BeyButton>
              ) : alreadyRegistered ? (
                <form action={unregisterFromTournament}>
                  <input type="hidden" name="tournamentId" value={tournament.id} />
                  <BeyButton variant="danger" type="submit">
                    Drop Tournament
                  </BeyButton>
                </form>
              ) : isFull ? (
                <span className="inline-flex items-center rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-bold text-red-300">
                  Tournament Full
                </span>
              ) : (
                <form action={registerForTournament}>
                  <input type="hidden" name="tournamentId" value={tournament.id} />
                  <BeyButton type="submit">Register Now</BeyButton>
                </form>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
              <p>Created by {tournament.createdBy.username}</p>
              <p className="mt-2">
                Registered players: {tournament._count.registrations}/{tournament.maxPlayers}
              </p>
            </div>
          </GlassCard>

          <GlassCard strong className="p-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300/80">
              Registered Players
            </p>

            <h2 className="mt-3 text-2xl font-extrabold text-white">
              Player List
            </h2>

            {tournament.registrations.length === 0 ? (
              <p className="mt-4 text-slate-400">No registrations yet.</p>
            ) : (
              <div className="mt-5 space-y-3">
                {tournament.registrations.map((registration, index) => (
                  <div
                    key={registration.id}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-white">
                        #{index + 1} {registration.user.username}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(registration.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </PageShell>
  );
}