import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createTournament } from "./actions";

export default async function CreateTournamentPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold">Create Tournament</h1>
        <p className="mt-2 text-zinc-400">
          Admin-only page for creating a new event.
        </p>

        <form
          action={createTournament}
          className="mt-8 space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>
            <input
              name="title"
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none ring-0 placeholder:text-zinc-500 focus:border-blue-500"
              placeholder="Spring Championship"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows={4}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-blue-500"
              placeholder="Tournament details..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Location</label>
            <input
              name="location"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-blue-500"
              placeholder="Salt Lake City"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Max Players</label>
            <input
              name="maxPlayers"
              type="number"
              min="2"
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none placeholder:text-zinc-500 focus:border-blue-500"
              placeholder="32"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Start Date</label>
            <input
              name="startDate"
              type="datetime-local"
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium hover:bg-blue-500"
          >
            Create Tournament
          </button>
        </form>
      </div>
    </main>
  );
}