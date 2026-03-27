import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import HeroSection from "@/components/home/HeroSection";
import FeatureCards from "@/components/home/FeatureCards";
import TournamentCard from "@/components/tournaments/TournamentCard";
import BuildCard from "@/components/builds/BuildCard";

export default async function HomePage() {
  const [featuredTournaments, featuredBuilds] = await Promise.all([
    prisma.tournament.findMany({
      orderBy: { startDate: "asc" },
      take: 3,
      include: {
        createdBy: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    }),
    prisma.build.findMany({
      where: { visibility: "PUBLIC" },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        user: {
          select: {
            username: true,
          },
        },
        blade: true,
        ratchet: true,
        bit: true,
      },
    }),
  ]);

  return (
    <PageShell>
      <div className="space-y-10">
        <HeroSection />

        <FeatureCards />

        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Upcoming Battles"
              title="Featured Tournaments"
              subtitle="Jump into upcoming events and secure your place in the bracket."
            />
            <Link
              href="/tournaments"
              className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-300 md:inline-flex"
            >
              View all
            </Link>
          </div>

          {featuredTournaments.length === 0 ? (
            <div className="glass-panel p-8 text-slate-400">
              No tournaments yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredTournaments.map((tournament, index) => (
                <TournamentCard
                  key={tournament.id}
                  id={tournament.id}
                  title={tournament.title}
                  description={tournament.description}
                  location={tournament.location}
                  startDate={tournament.startDate}
                  status={tournament.status}
                  registrationsCount={tournament._count.registrations}
                  maxPlayers={tournament.maxPlayers}
                  createdByUsername={tournament.createdBy.username}
                  delay={index * 0.05}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Custom Combos"
              title="Latest Builds"
              subtitle="See community builds and discover powerful combinations."
            />
            <Link
              href="/builds"
              className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-300 md:inline-flex"
            >
              View all
            </Link>
          </div>

          {featuredBuilds.length === 0 ? (
            <div className="glass-panel p-8 text-slate-400">
              No builds yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredBuilds.map((build, index) => {
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
                    ownerName={build.user.username}
                    delay={index * 0.05}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}