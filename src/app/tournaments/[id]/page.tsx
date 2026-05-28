/**
 * Renders the tournaments/[id] route and loads the server data needed by that screen.
 */
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { canEditTournament } from "@/lib/auth";
import type { Role } from "@prisma/client";
import PageShell from "@/components/ui/PageShell";
import GlassCard from "@/components/ui/GlassCard";
import BeyButton from "@/components/ui/BeyButton";
import TournamentHero from "@/components/tournaments/TournamentHero";
import { requestToJoinTournament, unregisterFromTournament } from "./actions";

/**
 * Renders the tournament detail page route with the data and access checks it requires.
 */
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

  let dbUser: { id: string; username: string | null; role: string } | null = null;

  if (userId) {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
  }

  const currentUserJoinRequest = dbUser
    ? await prisma.tournamentJoinRequest.findUnique({
        where: {
          userId_tournamentId: {
            userId: dbUser.id,
            tournamentId: id,
          },
        },
      })
    : null;

  const canEdit =
    dbUser && (await canEditTournament(dbUser as { id: string; role: Role }, id));

  const alreadyRegistered = !!tournament.registrations.find(
    (registration) => registration.userId === dbUser?.id
  );

  const isFull = tournament._count.registrations >= tournament.maxPlayers;
  const registrationClosed = tournament.startDate <= new Date();

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

        {canEdit ? (
          <div>
            <BeyButton href={`/staff/tournaments/${tournament.id}/edit`} variant="ghost">
              Edit tournament
            </BeyButton>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard strong className="p-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-300/80">
              Registration
            </p>

            <h2 className="mt-3 text-2xl font-extrabold text-white">
              {alreadyRegistered
                ? "You are registered"
                : currentUserJoinRequest?.status === "PENDING"
                ? "Request pending"
                : currentUserJoinRequest?.status === "REJECTED"
                ? "Request a new review"
                : registrationClosed
                ? "Registration closed"
                : "Request to join"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {alreadyRegistered
                ? registrationClosed
                  ? "This tournament has started, so registrations can no longer be changed."
                  : "You can drop from this event if your plans changed."
                : currentUserJoinRequest?.status === "PENDING"
                ? "Staff will review your request before adding you to the bracket."
                : currentUserJoinRequest?.status === "REJECTED"
                ? "Your last request was rejected. You can update the form and submit it again."
                : registrationClosed
                ? "Sign-ups closed when this tournament started."
                : isFull
                ? "This tournament is currently full."
                : "Tell staff why you want to join. Approved requests become registrations."}
            </p>

            <div className="mt-5">
              {registrationClosed && !alreadyRegistered ? (
                <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200">
                  Registration Closed
                </span>
              ) : !userId ? (
                <BeyButton href="/sign-in">Sign In to Request</BeyButton>
              ) : alreadyRegistered ? (
                registrationClosed ? (
                  <span className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200">
                    Registration Locked
                  </span>
                ) : (
                  <form action={unregisterFromTournament}>
                    <input type="hidden" name="tournamentId" value={tournament.id} />
                    <BeyButton variant="danger" type="submit">
                      Drop Tournament
                    </BeyButton>
                  </form>
                )
              ) : currentUserJoinRequest?.status === "PENDING" ? (
                <span className="inline-flex items-center rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-sm font-bold text-sky-200">
                  Awaiting Staff Review
                </span>
              ) : isFull ? (
                <span className="inline-flex items-center rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-bold text-red-300">
                  Tournament Full
                </span>
              ) : (
                <form action={requestToJoinTournament} className="space-y-4">
                  <input type="hidden" name="tournamentId" value={tournament.id} />
                  <label className="block">
                    <span className="text-sm font-semibold text-white">
                      Why do you want to join? *
                    </span>
                    <textarea
                      name="message"
                      required
                      minLength={20}
                      rows={4}
                      defaultValue={currentUserJoinRequest?.message ?? ""}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50"
                      placeholder="Share your goals, availability, or anything staff should know."
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-white">
                      Tournament experience
                    </span>
                    <textarea
                      name="experience"
                      rows={3}
                      defaultValue={currentUserJoinRequest?.experience ?? ""}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50"
                      placeholder="List previous events, rankings, or first-timer status."
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-white">
                      Preferred build
                    </span>
                    <input
                      name="preferredBuild"
                      defaultValue={currentUserJoinRequest?.preferredBuild ?? ""}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50"
                      placeholder="Example: Wizard Rod 5-70 Ball"
                    />
                  </label>

                  <BeyButton type="submit">
                    {currentUserJoinRequest?.status === "REJECTED"
                      ? "Resubmit Request"
                      : "Submit Request"}
                  </BeyButton>
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
