import Link from "next/link";
import { redirect } from "next/navigation";
import { requireStaffUser } from "@/lib/auth";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import PartForm from "../PartForm";
import type { PartType } from "../actions";

const validTypes: PartType[] = ["blade", "ratchet", "bit"];

export default async function NewPartPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await requireStaffUser();
  const { type } = await searchParams;

  if (!type || !validTypes.includes(type as PartType)) {
    redirect("/staff/parts");
  }

  const partType = type as PartType;
  const label = partType.charAt(0).toUpperCase() + partType.slice(1);

  return (
    <PageShell>
      <Link
        href="/staff/parts"
        className="inline-flex text-sm text-slate-400 transition hover:text-white"
      >
        ← Back to parts
      </Link>

      <SectionHeader
        eyebrow="Staff"
        title={`Add ${label}`}
        subtitle="New part will appear in the build creator for all players."
      />

      <PartForm partType={partType} mode="create" />
    </PageShell>
  );
}
