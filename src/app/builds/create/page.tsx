import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import BuildForm from "./BuildForm";

export default async function CreateBuildPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [blades, ratchets, bits] = await Promise.all([
    prisma.blade.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.ratchet.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.bit.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <PageShell>
      <SectionHeader
        eyebrow="Build Creator"
        title="Create Build"
        subtitle="Pick your blade, ratchet, and bit to assemble a new combo."
      />

      <BuildForm blades={blades} ratchets={ratchets} bits={bits} />
    </PageShell>
  );
}