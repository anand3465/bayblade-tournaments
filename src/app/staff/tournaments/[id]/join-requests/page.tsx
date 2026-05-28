/**
 * Renders the staff review queue for tournament join requests.
 */
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { canEditTournament, requireStaffUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";
import BeyButton from "@/components/ui/BeyButton";
import { approveJoinRequest, rejectJoinRequest } from "./actions";

/**
 * Renders pending and reviewed requests for one tournament.
 */
export default async function TournamentJoinRequestsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staffUser = await requireStaffUser();

  if (!(await canEditTournament(staffUser, id))) {
    redirect("/staff/tournaments");
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      _count: { select: { registrations: true } },
      joinRequests: {
        include: {
          user: {
            select: {
              username: true,
              email: true,
            },
          },
          reviewedBy: {
            select: {
              username: true,
            },
          },
        },
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!tournament) {
    notFound();
  }

  const pendingRequests = tournament.joinRequests.filter(
    (request) => request.status === "PENDING"
  );
  const reviewedRequests = tournament.joinRequests.filter(
    (request) => request.status !== "PENDING"
  );
  const isFull = tournament._count.registrations >= tournament.maxPlayers;
  const isClosed = tournament.startDate <= new Date();

  return (
    <PageShell>
      <Link
        href="/staff/tournaments"
        className="inline-flex text-sm text-slate-400 transition hover:text-white"
      >
        â† Back to tournaments
      </Link>

      <SectionHeader
        eyebrow="Staff Review"
        title="Join Requests"
        subtitle={tournament.title}
      />

      <GlassCard strong className="mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-300">
          <p>
            Registered players: {tournament._count.registrations}/
            {tournament.maxPlayers}
          </p>
          {isClosed ? (
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 font-bold text-amber-200">
              Tournament started
            </span>
          ) : isFull ? (
            <span className="rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1 font-bold text-red-300">
              Tournament full
            </span>
          ) : null}
        </div>
      </GlassCard>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-extrabold text-white">
            Pending ({pendingRequests.length})
          </h2>

          {pendingRequests.length === 0 ? (
            <GlassCard className="mt-4 p-6 text-slate-400">
              No pending join requests.
            </GlassCard>
          ) : (
            <div className="mt-4 space-y-4">
              {pendingRequests.map((request) => (
                <GlassCard key={request.id} strong className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-white">
                        {request.user.username}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {request.user.email} · requested{" "}
                        {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <StatusBadge value={request.status} />
                  </div>

                  <div className="mt-5 grid gap-4 text-sm text-slate-300 md:grid-cols-3">
                    <div className="md:col-span-3">
                      <p className="font-bold text-white">Request message</p>
                      <p className="mt-1 leading-6">{request.message}</p>
                    </div>
                    <div>
                      <p className="font-bold text-white">Experience</p>
                      <p className="mt-1 leading-6">
                        {request.experience || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-white">Preferred build</p>
                      <p className="mt-1 leading-6">
                        {request.preferredBuild || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <form action={approveJoinRequest}>
                      <input type="hidden" name="requestId" value={request.id} />
                      <BeyButton type="submit" disabled={isClosed || isFull}>
                        Approve
                      </BeyButton>
                    </form>

                    <form action={rejectJoinRequest} className="flex flex-wrap gap-3">
                      <input type="hidden" name="requestId" value={request.id} />
                      <input
                        name="staffNote"
                        className="min-w-64 rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50"
                        placeholder="Optional staff note"
                      />
                      <BeyButton type="submit" variant="danger">
                        Reject
                      </BeyButton>
                    </form>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-extrabold text-white">Reviewed</h2>

          {reviewedRequests.length === 0 ? (
            <GlassCard className="mt-4 p-6 text-slate-400">
              No reviewed requests yet.
            </GlassCard>
          ) : (
            <div className="mt-4 space-y-3">
              {reviewedRequests.map((request) => (
                <GlassCard key={request.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">
                        {request.user.username}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Reviewed by {request.reviewedBy?.username || "staff"} on{" "}
                        {request.reviewedAt
                          ? new Date(request.reviewedAt).toLocaleString()
                          : "unknown date"}
                      </p>
                      {request.staffNote ? (
                        <p className="mt-2 text-sm text-slate-300">
                          Note: {request.staffNote}
                        </p>
                      ) : null}
                    </div>
                    <StatusBadge value={request.status} />
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
