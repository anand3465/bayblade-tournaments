import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import { prisma } from "@/lib/prisma";
import TournamentCard from "@/components/tournaments/TournamentCard";

export default async function TournamentsPage() {
  const tournaments = await prisma.tournament.findMany({
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
    <PageShell>
      <SectionHeader
        eyebrow="Arena Events"
        title="Tournaments"
        subtitle="Browse upcoming battles, track capacity, and enter the arena."
      />

      {tournaments.length === 0 ? (
        <div className="glass-panel p-8 text-slate-400">
          No tournaments yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tournaments.map((tournament, index) => (
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
    </PageShell>
  );
}