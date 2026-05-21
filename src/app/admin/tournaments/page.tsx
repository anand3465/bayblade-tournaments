import Link from "next/link";
import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";

export default async function AdminTournamentsPage() {
  await requireAdminUser();

  const tournaments = await prisma.tournament.findMany({
    orderBy: { startDate: "asc" },
    include: {
      _count: {
        select: { registrations: true, assignments: true },
      },
    },
  });

  return (
    <PageShell>
      <Link href="/admin" className="inline-flex text-sm text-slate-400 hover:text-white">
        ← Back to admin
      </Link>

      <SectionHeader
        eyebrow="Admin"
        title="Tournaments"
        subtitle="Assign employees to tournaments they can manage."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {tournaments.map((tournament) => (
          <GlassCard key={tournament.id} strong className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="text-xl font-extrabold text-white">{tournament.title}</h3>
              <StatusBadge value={tournament.status} />
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {new Date(tournament.startDate).toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Staff assigned: {tournament._count.assignments}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/admin/tournaments/${tournament.id}/assignments`}
                className="inline-flex rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-4 py-2 text-sm font-extrabold text-slate-950"
              >
                Manage staff
              </Link>
              <Link
                href={`/staff/tournaments/${tournament.id}/edit`}
                className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200"
              >
                Edit
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </PageShell>
  );
}
