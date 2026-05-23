/**
 * Renders the staff/parts/[id]/edit route and loads the server data needed by that screen.
 */
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireStaffUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import PartForm from "../../PartForm";
import type { PartType } from "../../actions";

const validTypes: PartType[] = ["blade", "ratchet", "bit"];

/**
 * Renders the edit part page route with the data and access checks it requires.
 */
export default async function EditPartPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  await requireStaffUser();
  const { id } = await params;
  const { type } = await searchParams;

  if (!type || !validTypes.includes(type as PartType)) {
    redirect("/staff/parts");
  }

  const partType = type as PartType;
  const label = partType.charAt(0).toUpperCase() + partType.slice(1);

  if (partType === "blade") {
    const blade = await prisma.blade.findUnique({ where: { id } });
    if (!blade) notFound();

    return (
      <PageShell>
        <Link
          href="/staff/parts"
          className="inline-flex text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to parts
        </Link>

        <SectionHeader eyebrow="Staff" title={`Edit ${label}`} subtitle={blade.name} />

        <PartForm
          partType="blade"
          mode="edit"
          partId={blade.id}
          defaultValues={blade}
        />
      </PageShell>
    );
  }

  if (partType === "ratchet") {
    const ratchet = await prisma.ratchet.findUnique({ where: { id } });
    if (!ratchet) notFound();

    return (
      <PageShell>
        <Link
          href="/staff/parts"
          className="inline-flex text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to parts
        </Link>

        <SectionHeader eyebrow="Staff" title={`Edit ${label}`} subtitle={ratchet.name} />

        <PartForm
          partType="ratchet"
          mode="edit"
          partId={ratchet.id}
          defaultValues={ratchet}
        />
      </PageShell>
    );
  }

  const bit = await prisma.bit.findUnique({ where: { id } });
  if (!bit) notFound();

  return (
    <PageShell>
      <Link
        href="/staff/parts"
        className="inline-flex text-sm text-slate-400 transition hover:text-white"
      >
        ← Back to parts
      </Link>

      <SectionHeader eyebrow="Staff" title={`Edit ${label}`} subtitle={bit.name} />

      <PartForm partType="bit" mode="edit" partId={bit.id} defaultValues={bit} />
    </PageShell>
  );
}
