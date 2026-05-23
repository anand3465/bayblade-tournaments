/**
 * Renders the admin/applications route and loads the server data needed by that screen.
 */
import Link from "next/link";
import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";

/**
 * Renders the admin applications page route with the data and access checks it requires.
 */
export default async function AdminApplicationsPage() {
  await requireAdminUser();

  const applications = await prisma.employeeApplication.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true, email: true } },
      _count: { select: { tournamentEntries: true } },
    },
  });

  return (
    <PageShell>
      <Link href="/admin" className="inline-flex text-sm text-slate-400 hover:text-white">
        ← Back to admin
      </Link>

      <SectionHeader
        eyebrow="Admin"
        title="Employee applications"
        subtitle="Review pending requests to join staff."
      />

      {applications.length === 0 ? (
        <GlassCard className="p-6 text-slate-400">No pending applications.</GlassCard>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <GlassCard key={app.id} strong className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    {app.user.username}
                  </h3>
                  <p className="text-sm text-slate-400">{app.user.email}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                    {app.message}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {app._count.tournamentEntries} tournament(s) ·{" "}
                    {new Date(app.createdAt).toLocaleString()}
                  </p>
                </div>
                <Link
                  href={`/admin/applications/${app.id}`}
                  className="inline-flex rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 px-4 py-2 text-sm font-extrabold text-slate-950"
                >
                  Review
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </PageShell>
  );
}
