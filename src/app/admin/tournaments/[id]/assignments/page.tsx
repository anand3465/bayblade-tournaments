import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import { setTournamentAssignments } from "../../assignments/actions";

export default async function TournamentAssignmentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminUser();
  const { id } = await params;

  const [tournament, employees, assignments] = await Promise.all([
    prisma.tournament.findUnique({ where: { id } }),
    prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      orderBy: { username: "asc" },
      select: { id: true, username: true, email: true },
    }),
    prisma.tournamentAssignment.findMany({
      where: { tournamentId: id },
      select: { userId: true },
    }),
  ]);

  if (!tournament) notFound();

  const assignedIds = new Set(assignments.map((a) => a.userId));

  return (
    <PageShell>
      <Link
        href="/admin/tournaments"
        className="inline-flex text-sm text-slate-400 hover:text-white"
      >
        ← Back to tournaments
      </Link>

      <SectionHeader
        eyebrow="Admin"
        title="Assign staff"
        subtitle={tournament.title}
      />

      <GlassCard strong className="p-6">
        {employees.length === 0 ? (
          <p className="text-slate-400">
            No employees yet. Approve an application first.
          </p>
        ) : (
          <form action={setTournamentAssignments} className="space-y-4">
            <input type="hidden" name="tournamentId" value={tournament.id} />

            <div className="space-y-3">
              {employees.map((employee) => (
                <label
                  key={employee.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <input
                    type="checkbox"
                    name="employeeIds"
                    value={employee.id}
                    defaultChecked={assignedIds.has(employee.id)}
                    className="h-4 w-4"
                  />
                  <span>
                    <span className="font-semibold text-white">
                      {employee.username}
                    </span>
                    <span className="ml-2 text-sm text-slate-400">
                      {employee.email}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-amber-300 to-yellow-500 px-4 py-3 font-extrabold text-slate-950"
            >
              Save assignments
            </button>
          </form>
        )}
      </GlassCard>
    </PageShell>
  );
}
