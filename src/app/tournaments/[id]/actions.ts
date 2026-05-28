/**
 * Provides server actions for the tournaments/[id] workflow, including validation, persistence, and cache refreshes.
 */
"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

/**
 * Server action that handles the request-to-join tournament workflow.
 */
export async function requestToJoinTournament(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const tournamentId = String(formData.get("tournamentId") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const experience = String(formData.get("experience") || "").trim();
  const preferredBuild = String(formData.get("preferredBuild") || "").trim();

  if (message.length < 20) {
    throw new Error("Please write at least 20 characters for staff to review.");
  }

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

  if (new Date(tournament.startDate) <= new Date()) {
    throw new Error("Registration is closed for this tournament.");
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

  const existingRequest = await prisma.tournamentJoinRequest.findUnique({
    where: {
      userId_tournamentId: {
        userId: dbUser.id,
        tournamentId,
      },
    },
  });

  if (existingRequest?.status === "PENDING" || existingRequest?.status === "APPROVED") {
    return;
  }

  if (tournament._count.registrations >= tournament.maxPlayers) {
    throw new Error("Tournament is full.");
  }

  if (existingRequest) {
    await prisma.tournamentJoinRequest.update({
      where: { id: existingRequest.id },
      data: {
        message,
        experience: experience || null,
        preferredBuild: preferredBuild || null,
        status: "PENDING",
        staffNote: null,
        reviewedById: null,
        reviewedAt: null,
      },
    });
  } else {
    await prisma.tournamentJoinRequest.create({
      data: {
        userId: dbUser.id,
        tournamentId,
        message,
        experience: experience || null,
        preferredBuild: preferredBuild || null,
      },
    });
  }

  redirect(`/tournaments/${tournamentId}`);
}

/**
 * Server action that handles the unregister from tournament workflow and refreshes affected routes.
 */
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

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) {
    throw new Error("Tournament not found.");
  }

  if (new Date(tournament.startDate) <= new Date()) {
    throw new Error("Tournament has already started.");
  }

  await prisma.registration.deleteMany({
    where: {
      userId: dbUser.id,
      tournamentId,
    },
  });

  redirect(`/tournaments/${tournamentId}`);
}
