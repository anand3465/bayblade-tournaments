import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { canEditTournament, requireStaffUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import { updateTournament } from "../../actions";

function toDatetimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-sky-400/50";

export default async function EditTournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const dbUser = await requireStaffUser();
  const { id } = await params;

  if (!(await canEditTournament(dbUser, id))) {
    redirect("/staff/tournaments");
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      _count: {
        select: { registrations: true },
      },
    },
  });

  if (!tournament) {
    notFound();
  }

  return (
    <PageShell>
      <Link
        href="/staff/tournaments"
        className="inline-flex text-sm text-slate-400 transition hover:text-white"
      >
        ← Back to tournaments
      </Link>

      <SectionHeader
        eyebrow="Staff"
        title="Edit Tournament"
        subtitle={tournament.title}
      />

      <GlassCard strong className="p-6">
        <p className="mb-6 text-sm text-slate-400">
          Current registrations: {tournament._count.registrations}. Max players
          cannot be set below this count.
        </p>

        <form action={updateTournament} className="space-y-5">
          <input type="hidden" name="tournamentId" value={tournament.id} />

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Title</label>
            <input
              name="title"
              required
              defaultValue={tournament.title}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={tournament.description ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Location</label>
            <input
              name="location"
              defaultValue={tournament.location ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Max Players
            </label>
            <input
              name="maxPlayers"
              type="number"
              min={tournament._count.registrations}
              required
              defaultValue={tournament.maxPlayers}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Start Date
            </label>
            <input
              name="startDate"
              type="datetime-local"
              required
              defaultValue={toDatetimeLocalValue(tournament.startDate)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Status</label>
            <select
              name="status"
              defaultValue={tournament.status}
              className={inputClass}
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-sky-400 to-cyan-500 px-4 py-3 font-extrabold text-white transition hover:opacity-90"
          >
            Save changes
          </button>
        </form>
      </GlassCard>
    </PageShell>
  );
}
