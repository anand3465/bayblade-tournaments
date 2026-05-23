/**
 * Renders the admin/applications/[id] route and loads the server data needed by that screen.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import { approveApplication, rejectApplication } from "../actions";

const roleLabels: Record<string, string> = {
  PARTICIPANT: "Participant",
  VOLUNTEER: "Volunteer",
  ORGANIZER: "Organizer",
  OTHER: "Other",
};

/**
 * Renders the application detail page route with the data and access checks it requires.
 */
export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminUser();
  const { id } = await params;

  const application = await prisma.employeeApplication.findUnique({
    where: { id },
    include: {
      user: { select: { username: true, email: true } },
      tournamentEntries: { orderBy: { eventDate: "desc" } },
    },
  });

  if (!application) notFound();

  return (
    <PageShell>
      <Link
        href="/admin/applications"
        className="inline-flex text-sm text-slate-400 hover:text-white"
      >
        ← Back to applications
      </Link>

      <SectionHeader
        eyebrow="Application"
        title={application.user.username}
        subtitle={application.user.email}
      />

      <div className="space-y-6">
        <GlassCard strong className="p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-sky-300/80">
            Status: {application.status}
          </p>
          <h3 className="mt-4 text-lg font-bold text-white">Why they want to join</h3>
          <p className="mt-2 whitespace-pre-wrap text-slate-300">{application.message}</p>
          {application.experience ? (
            <>
              <h3 className="mt-6 text-lg font-bold text-white">Experience</h3>
              <p className="mt-2 whitespace-pre-wrap text-slate-300">
                {application.experience}
              </p>
            </>
          ) : null}
        </GlassCard>

        <GlassCard strong className="p-6">
          <h3 className="text-lg font-extrabold text-white">Tournament history</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-slate-400">
                  <th className="py-2 pr-3">Event</th>
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Role</th>
                  <th className="py-2 pr-3">Result</th>
                  <th className="py-2">Platform</th>
                </tr>
              </thead>
              <tbody>
                {application.tournamentEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-white/5">
                    <td className="py-3 pr-3">
                      <p className="font-semibold text-white">{entry.tournamentName}</p>
                      {entry.location ? (
                        <p className="text-xs text-slate-400">{entry.location}</p>
                      ) : null}
                      {entry.notes ? (
                        <p className="mt-1 text-xs text-slate-500">{entry.notes}</p>
                      ) : null}
                    </td>
                    <td className="py-3 pr-3 text-slate-300">
                      {new Date(entry.eventDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-3 text-slate-300">
                      {roleLabels[entry.roleAtEvent] ?? entry.roleAtEvent}
                    </td>
                    <td className="py-3 pr-3 text-slate-300">
                      {entry.placementOrResult || "—"}
                      {entry.organizerOrVenue ? (
                        <p className="text-xs text-slate-500">{entry.organizerOrVenue}</p>
                      ) : null}
                    </td>
                    <td className="py-3 text-slate-300">
                      {entry.isPlatformEvent ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {application.status === "PENDING" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <GlassCard strong className="p-6">
              <form action={approveApplication}>
                <input type="hidden" name="applicationId" value={application.id} />
                <p className="text-sm text-slate-400">
                  Promote to employee. They will need tournament assignments before
                  editing events.
                </p>
                <button
                  type="submit"
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 px-4 py-3 font-extrabold text-white"
                >
                  Approve
                </button>
              </form>
            </GlassCard>

            <GlassCard strong className="p-6">
              <form action={rejectApplication} className="space-y-4">
                <input type="hidden" name="applicationId" value={application.id} />
                <label className="block text-sm font-medium text-white">
                  Rejection note (optional)
                </label>
                <textarea
                  name="adminNote"
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white"
                  placeholder="Reason for rejection..."
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-rose-400 to-red-500 px-4 py-3 font-extrabold text-white"
                >
                  Reject
                </button>
              </form>
            </GlassCard>
          </div>
        ) : null}
      </div>
    </PageShell>
  );
}
