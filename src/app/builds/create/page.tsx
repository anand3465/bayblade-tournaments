import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BuildForm from "./BuildForm";

export default async function CreateBuildPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const [blades, ratchets, bits] = await Promise.all([
    prisma.blade.findMany({ orderBy: { name: "asc" } }),
    prisma.ratchet.findMany({ orderBy: { name: "asc" } }),
    prisma.bit.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom,#09090b,#111827,#09090b)] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-400">
            Custom Builder
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tight">
            Forge Your Beyblade
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
            Pick your parts, watch the stats react live, and build a combo with a
            little more energy and arena feel.
          </p>
        </div>

        <BuildForm blades={blades} ratchets={ratchets} bits={bits} />
      </div>
    </main>
  );
}