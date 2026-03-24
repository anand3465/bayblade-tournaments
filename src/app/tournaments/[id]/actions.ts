"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function registerForTournament(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const tournamentId = String(formData.get("tournamentId") || "");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    redirect("/dashboard");
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      _count: {
        select: {
          registrations: true,
        },
      },
    },
  });

  if (!tournament) {
    throw new Error("Tournament not found.");
  }

  const existing = await prisma.registration.findFirst({
    where: {
      userId: dbUser.id,
      tournamentId,
    },
  });

  if (existing) {
    return;
  }

  if (tournament._count.registrations >= tournament.maxPlayers) {
    throw new Error("Tournament is full.");
  }

  await prisma.registration.create({
    data: {
      userId: dbUser.id,
      tournamentId,
    },
  });

  redirect(`/tournaments/${tournamentId}`);
}

export async function unregisterFromTournament(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const tournamentId = String(formData.get("tournamentId") || "");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    redirect("/dashboard");
  }

  // ✅ ADD THIS BLOCK (the optional section)
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) {
    throw new Error("Tournament not found.");
  }

  if (new Date(tournament.startDate) <= new Date()) {
    throw new Error("Tournament has already started.");
  }
  // ✅ END OF OPTIONAL SECTION

  await prisma.registration.deleteMany({
    where: {
      userId: dbUser.id,
      tournamentId,
    },
  });

  redirect(`/tournaments/${tournamentId}`);
}