import Link from "next/link";
import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";

export default async function AdminPage() {
  await requireAdminUser();

  const pendingCount = await prisma.employeeApplication.count({
    where: { status: "PENDING" },
  });

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Admin"
        title="Admin Panel"
        subtitle="Manage applications, staff assignments, and tournaments."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GlassCard strong className="p-6">
          <h2 className="text-xl font-extrabold text-white">Applications</h2>
          <p className="mt-2 text-sm text-slate-400">
            Review employee requests from players.
            {pendingCount > 0 ? (
              <span className="mt-2 block font-bold text-amber-300">
                {pendingCount} pending
              </span>
            ) : null}
          </p>
          <div className="mt-5">
            <Link
              href="/admin/applications"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-4 py-2 text-sm font-extrabold text-slate-950"
            >
              Review applications
            </Link>
          </div>
        </GlassCard>

        <GlassCard strong className="p-6">
          <h2 className="text-xl font-extrabold text-white">Tournaments</h2>
          <p className="mt-2 text-sm text-slate-400">
            Assign staff to tournaments and edit events.
          </p>
          <div className="mt-5">
            <Link
              href="/admin/tournaments"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-300"
            >
              Manage tournaments
            </Link>
          </div>
        </GlassCard>

        <GlassCard strong className="p-6">
          <h2 className="text-xl font-extrabold text-white">Create event</h2>
          <p className="mt-2 text-sm text-slate-400">Launch a new tournament.</p>
          <div className="mt-5">
            <Link
              href="/admin/tournaments/create"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-4 py-2 text-sm font-extrabold text-white"
            >
              Create tournament
            </Link>
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}
