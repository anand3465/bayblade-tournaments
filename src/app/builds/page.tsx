import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import BuildCard from "@/components/builds/BuildCard";
import Link from "next/link";

export default async function BuildsPage() {
  const { userId } = await auth();

  let dbUser: { id: string } | null = null;

  if (userId) {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
      },
    });
  }

  const builds = await prisma.build.findMany({
    where: dbUser
      ? {
          OR: [{ visibility: "PUBLIC" }, { userId: dbUser.id }],
        }
      : {
          visibility: "PUBLIC",
        },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      blade: true,
      ratchet: true,
      bit: true,
    },
  });

  return (
    <PageShell>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="Custom Combos"
          title="Build Library"
          subtitle="Browse public builds and your own saved combinations."
        />

        <Link
          href="/builds/create"
          className="inline-flex items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:border-cyan-300/60 hover:bg-cyan-400/20 hover:text-cyan-200"
        >
          Add Your Beyblade
        </Link>
      </div>

      {builds.length === 0 ? (
        <div className="glass-panel p-8 text-slate-400">
          No builds yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {builds.map((build, index) => {
            const totalAttack =
              build.blade.attack + build.ratchet.attack + build.bit.attack;
            const totalDefense =
              build.blade.defense + build.ratchet.defense + build.bit.defense;
            const totalStamina =
              build.blade.stamina + build.ratchet.stamina + build.bit.stamina;
            const totalWeight =
              (build.blade.weight ?? 0) +
              (build.ratchet.weight ?? 0) +
              (build.bit.weight ?? 0);
            const totalSpeed = build.bit.speed ?? 0;

            return (
              <BuildCard
                key={build.id}
                name={build.title}
                blade={build.blade.name}
                ratchet={build.ratchet.name}
                bit={build.bit.name}
                type={build.type ?? "Balance"}
                visibility={build.visibility}
                attack={totalAttack}
                defense={totalDefense}
                stamina={totalStamina}
                weight={totalWeight}
                speed={totalSpeed}
                ownerName={build.user.username}
                isOwner={build.user.id === dbUser?.id}
                delay={index * 0.05}
              />
            );
          })}
        </div>
      )}
    </PageShell>
  );
}