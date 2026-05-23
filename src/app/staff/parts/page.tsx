/**
 * Renders the staff/parts route and loads the server data needed by that screen.
 */
import Link from "next/link";
import { requireStaffUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";

/**
 * Renders a staff-managed table of parts with links to edit individual records.
 */
function PartTable({
  title,
  parts,
  partType,
}: {
  title: string;
  parts: { id: string; name: string; attack: number; defense: number; stamina: number }[];
  partType: "blade" | "ratchet" | "bit";
}) {
  return (
    <GlassCard strong className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-white">{title}</h2>
        <Link
          href={`/staff/parts/new?type=${partType}`}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-sky-300"
        >
          Add {partType}
        </Link>
      </div>

      {parts.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No parts yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">ATK</th>
                <th className="py-2 pr-4">DEF</th>
                <th className="py-2 pr-4">STA</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {parts.map((part) => (
                <tr key={part.id} className="border-b border-white/5">
                  <td className="py-3 pr-4 font-semibold text-white">{part.name}</td>
                  <td className="py-3 pr-4 text-slate-300">{part.attack}</td>
                  <td className="py-3 pr-4 text-slate-300">{part.defense}</td>
                  <td className="py-3 pr-4 text-slate-300">{part.stamina}</td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/staff/parts/${part.id}/edit?type=${partType}`}
                      className="text-sky-400 hover:text-sky-300"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </GlassCard>
  );
}

/**
 * Renders the staff parts page route with the data and access checks it requires.
 */
export default async function StaffPartsPage() {
  await requireStaffUser();

  const [blades, ratchets, bits] = await Promise.all([
    prisma.blade.findMany({ orderBy: { name: "asc" } }),
    prisma.ratchet.findMany({ orderBy: { name: "asc" } }),
    prisma.bit.findMany({ orderBy: { name: "asc" } }),
  ]);

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
        title="Parts Catalog"
        subtitle="Add or edit blades, ratchets, and bits. Players cannot modify the parts database."
      />

      <div className="space-y-6">
        <PartTable title="Blades" parts={blades} partType="blade" />
        <PartTable title="Ratchets" parts={ratchets} partType="ratchet" />
        <PartTable title="Bits" parts={bits} partType="bit" />
      </div>
    </PageShell>
  );
}
