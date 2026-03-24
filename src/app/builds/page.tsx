import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function BuildsPage() {
  const builds = await prisma.build.findMany({
    where: {
      visibility: "PUBLIC",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
      blade: true,
      ratchet: true,
      bit: true,
    },
  });

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Builds</h1>
            <p className="mt-2 text-zinc-400">
              Browse public Beyblade builds shared by the community.
            </p>
          </div>

          <Link
            href="/builds/create"
            className="rounded-xl bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
          >
            Create Build
          </Link>
        </div>

        {builds.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-400">
            No public builds yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {builds.map((build) => {
              const totalAttack =
                build.blade.attack + build.ratchet.attack + build.bit.attack;

              const totalDefense =
                build.blade.defense +
                build.ratchet.defense +
                build.bit.defense;

              const totalStamina =
                build.blade.stamina +
                build.ratchet.stamina +
                build.bit.stamina;

              const totalWeight =
                (build.blade.weight ?? 0) +
                (build.ratchet.weight ?? 0) +
                (build.bit.weight ?? 0);

              return (
                <div
                  key={build.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                      {build.visibility}
                    </span>
                    <span className="text-sm text-zinc-400">
                      by {build.user.username}
                    </span>
                  </div>

                  <h2 className="text-2xl font-semibold">{build.title}</h2>

                  {build.type && (
                    <p className="mt-2 text-sm text-zinc-400">{build.type}</p>
                  )}

                  <div className="mt-5 space-y-2 text-sm text-zinc-300">
                    <p>
                      <span className="font-medium text-white">Blade:</span>{" "}
                      {build.blade.name}
                    </p>
                    <p>
                      <span className="font-medium text-white">Ratchet:</span>{" "}
                      {build.ratchet.name}
                    </p>
                    <p>
                      <span className="font-medium text-white">Bit:</span>{" "}
                      {build.bit.name}
                    </p>
                  </div>

                  <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm">
                    <p className="font-semibold text-white">Combined Stats</p>
                    <div className="mt-3 space-y-2 text-zinc-300">
                      <p>
                        <span className="font-medium text-white">Attack:</span>{" "}
                        {totalAttack}
                      </p>
                      <p>
                        <span className="font-medium text-white">Defense:</span>{" "}
                        {totalDefense}
                      </p>
                      <p>
                        <span className="font-medium text-white">Stamina:</span>{" "}
                        {totalStamina}
                      </p>
                      <p>
                        <span className="font-medium text-white">Weight:</span>{" "}
                        {totalWeight.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {build.description && (
                    <p className="mt-4 text-sm text-zinc-400">
                      {build.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}