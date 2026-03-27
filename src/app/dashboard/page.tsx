import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";
import BuildCard from "@/components/builds/BuildCard";

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
          tournament: {
            include: {
              _count: {
                select: { registrations: true },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      builds: {
        orderBy: {
          createdAt: "desc",
        },
        take: 3,
        include: {
          blade: true,
          ratchet: true,
          bit: true,
        },
      },
      tournaments: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: { registrations: true },
          },
        },
      },
    },
  });

  if (!dbUser) {
    redirect("/sign-in");
  }

  const isAdmin = dbUser.role === "ADMIN";

  return (
    <PageShell>
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4">
          <SectionHeader
            eyebrow="Competitor Profile"
            title={dbUser.username || "Player"}
            subtitle={dbUser.email}
          />
          <SignOutButton>
            <button className="rounded-full bg-gradient-to-r from-rose-400 to-red-500 px-4 py-2 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(239,68,68,0.28)] transition hover:-translate-y-0.5">
              Sign Out
            </button>
          </SignOutButton>
        </div>

        <GlassCard strong className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-300/80">
                Arena Status
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-white">
                Welcome back, {dbUser.username || "Blader"}
              </h2>
              <p className="mt-2 text-slate-400">
                Manage your tournaments, builds, and profile from one command center.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge value={dbUser.role} />
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-200">
                {dbUser.registrations.length} registrations
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-200">
                {dbUser.builds.length} recent builds
              </span>
            </div>
          </div>
        </GlassCard>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="My Tournaments"
              title="Registrations"
              subtitle="Your current tournament entries and bracket status."
            />
            <Link
              href="/tournaments"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-300"
            >
              Browse tournaments
            </Link>
          </div>

          {dbUser.registrations.length === 0 ? (
            <GlassCard className="p-6 text-slate-400">
              You have not registered for any tournaments yet.
            </GlassCard>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {dbUser.registrations.map((registration) => {
                const tournament = registration.tournament;
                const isFull =
                  tournament._count.registrations >= tournament.maxPlayers;

                return (
                  <GlassCard key={registration.id} strong className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-extrabold text-white">
                          {tournament.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {new Date(tournament.startDate).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <StatusBadge value={tournament.status} />
                        {isFull ? (
                          <span className="inline-flex items-center rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-300">
                            Full
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                      <p>Location: {tournament.location || "Location TBA"}</p>
                      <p>
                        Players: {tournament._count.registrations}/{tournament.maxPlayers}
                      </p>
                      <p>
                        Registered on: {new Date(registration.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-5">
                      <Link
                        href={`/tournaments/${tournament.id}`}
                        className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-4 py-2 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5"
                      >
                        View tournament
                      </Link>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="My Loadouts"
              title="Recent Builds"
              subtitle="Your latest Beyblade combinations."
            />
            <Link
              href="/builds/create"
              className="rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-4 py-2 text-sm font-extrabold text-slate-950 shadow-[0_8px_24px_rgba(251,191,36,0.28)] transition hover:-translate-y-0.5"
            >
              Create build
            </Link>
          </div>

          {dbUser.builds.length === 0 ? (
            <GlassCard className="p-6 text-slate-400">
              You have not created any builds yet.
            </GlassCard>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {dbUser.builds.map((build, index) => {
                const totalAttack =
                  build.blade.attack + build.ratchet.attack + build.bit.attack;
                const totalDefense =
                  build.blade.defense + build.ratchet.defense + build.bit.defense;
                const totalStamina =
                  build.blade.stamina + build.ratchet.stamina + build.bit.stamina;
                const totalWeight =
                  (build.blade.weight ?? 0) +
                  (build.ratchet.weight ?? 0) +
                  (build.bit.weight ?? 0);
                const totalSpeed = build.bit.speed ?? 0;

                return (
                  <BuildCard
                    key={build.id}
                    name={build.title}
                    blade={build.blade.name}
                    ratchet={build.ratchet.name}
                    bit={build.bit.name}
                    type={build.type ?? "Balance"}
                    visibility={build.visibility}
                    attack={totalAttack}
                    defense={totalDefense}
                    stamina={totalStamina}
                    weight={totalWeight}
                    speed={totalSpeed}
                    ownerName={dbUser.username}
                    isOwner
                    delay={index * 0.05}
                  />
                );
              })}
            </div>
          )}
        </section>

        {isAdmin ? (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <SectionHeader
                eyebrow="Admin"
                title="Tournaments You Created"
                subtitle="Manage events you launched as an admin."
              />
              <Link
                href="/admin/tournaments/create"
                className="rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-4 py-2 text-sm font-extrabold text-slate-950 shadow-[0_8px_24px_rgba(251,191,36,0.28)] transition hover:-translate-y-0.5"
              >
                Create tournament
              </Link>
            </div>

            {dbUser.tournaments.length === 0 ? (
              <GlassCard className="p-6 text-slate-400">
                You have not created any tournaments yet.
              </GlassCard>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {dbUser.tournaments.map((tournament) => (
                  <GlassCard key={tournament.id} strong className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-extrabold text-white">
                          {tournament.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {new Date(tournament.startDate).toLocaleString()}
                        </p>
                      </div>
                      <StatusBadge value={tournament.status} />
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                      <p>Location: {tournament.location || "Location TBA"}</p>
                      <p>
                        Players: {tournament._count.registrations}/{tournament.maxPlayers}
                      </p>
                    </div>

                    <div className="mt-5">
                      <Link
                        href={`/tournaments/${tournament.id}`}
                        className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-300"
                      >
                        Open event
                      </Link>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}