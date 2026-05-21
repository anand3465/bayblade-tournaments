import Link from "next/link";
import { requireStaffUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";

export default async function StaffTournamentsPage() {
  const dbUser = await requireStaffUser();

  const tournaments =
    dbUser.role === "ADMIN"
      ? await prisma.tournament.findMany({
          orderBy: { startDate: "asc" },
          include: {
            _count: { select: { registrations: true } },
          },
        })
      : await prisma.tournament.findMany({
          where: {
            assignments: { some: { userId: dbUser.id } },
          },
          orderBy: { startDate: "asc" },
          include: {
            _count: { select: { registrations: true } },
          },
        });

  return (
    <PageShell>
      <Link
        href="/staff"
        className="inline-flex text-sm text-slate-400 transition hover:text-white"
      >
        ← Back to staff panel
      </Link>

      <SectionHeader
        eyebrow="Staff"
        title="Tournaments"
        subtitle={
          dbUser.role === "ADMIN"
            ? "Edit any tournament in the system."
            : "Edit only tournaments you are assigned to."
        }
      />

      {tournaments.length === 0 ? (
        <GlassCard className="p-6 text-slate-400">
          {dbUser.role === "EMPLOYEE"
            ? "No tournaments assigned to you yet. Ask an admin to assign you."
            : "No tournaments yet."}
        </GlassCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tournaments.map((tournament) => (
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

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/staff/tournaments/${tournament.id}/edit`}
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-4 py-2 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5"
                >
                  Edit
                </Link>
                <Link
                  href={`/tournaments/${tournament.id}`}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-300"
                >
                  View
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </PageShell>
  );
}
