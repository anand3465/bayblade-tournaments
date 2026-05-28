/**
 * Renders the staff route and loads the server data needed by that screen.
 */
import Link from "next/link";
import { requireStaffUser } from "@/lib/auth";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";

/**
 * Renders the staff hub page route with the data and access checks it requires.
 */
export default async function StaffHubPage() {
  await requireStaffUser();

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Staff"
        title="Staff Panel"
        subtitle="Manage beyblade parts, tournament details, and player join requests."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <GlassCard strong className="p-6">
          <h2 className="text-2xl font-extrabold text-white">Parts Catalog</h2>
          <p className="mt-2 text-sm text-slate-400">
            Add or edit blades, ratchets, and bits in the database. Players can
            only select existing parts when building.
          </p>
          <div className="mt-5">
            <Link
              href="/staff/parts"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-4 py-2 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5"
            >
              Manage parts
            </Link>
          </div>
        </GlassCard>

        <GlassCard strong className="p-6">
          <h2 className="text-2xl font-extrabold text-white">Tournaments</h2>
          <p className="mt-2 text-sm text-slate-400">
            Update tournament details for events you are assigned to (admins:
            all events), and review player requests to join.
          </p>
          <div className="mt-5">
            <Link
              href="/staff/tournaments"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-400 to-cyan-500 px-4 py-2 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(56,189,248,0.28)] transition hover:-translate-y-0.5"
            >
              Manage tournaments
            </Link>
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}
