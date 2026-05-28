/**
 * Provides server actions for reviewing tournament join requests.
 */
"use server";

import { redirect } from "next/navigation";
import { canEditTournament, requireStaffUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Approves a player join request and creates the tournament registration.
 */
export async function approveJoinRequest(formData: FormData) {
  const staffUser = await requireStaffUser();
  const requestId = String(formData.get("requestId") || "").trim();

  if (!requestId) {
    throw new Error("Request id is required.");
  }

  const joinRequest = await prisma.tournamentJoinRequest.findUnique({
    where: { id: requestId },
    include: {
      tournament: {
        include: {
          _count: { select: { registrations: true } },
        },
      },
    },
  });

  if (!joinRequest || joinRequest.status !== "PENDING") {
    throw new Error("Join request not found or already reviewed.");
  }

  if (!(await canEditTournament(staffUser, joinRequest.tournamentId))) {
    throw new Error("You are not assigned to review this tournament.");
  }

  if (joinRequest.tournament.startDate <= new Date()) {
    throw new Error("This tournament has already started.");
  }

  if (joinRequest.tournament._count.registrations >= joinRequest.tournament.maxPlayers) {
    throw new Error("Tournament is full.");
  }

  await prisma.$transaction([
    prisma.registration.upsert({
      where: {
        userId_tournamentId: {
          userId: joinRequest.userId,
          tournamentId: joinRequest.tournamentId,
        },
      },
      update: {},
      create: {
        userId: joinRequest.userId,
        tournamentId: joinRequest.tournamentId,
      },
    }),
    prisma.tournamentJoinRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        reviewedById: staffUser.id,
        reviewedAt: new Date(),
      },
    }),
  ]);

  redirect(`/staff/tournaments/${joinRequest.tournamentId}/join-requests`);
}

/**
 * Rejects a player join request with an optional staff note.
 */
export async function rejectJoinRequest(formData: FormData) {
  const staffUser = await requireStaffUser();
  const requestId = String(formData.get("requestId") || "").trim();
  const staffNote = String(formData.get("staffNote") || "").trim();

  if (!requestId) {
    throw new Error("Request id is required.");
  }

  const joinRequest = await prisma.tournamentJoinRequest.findUnique({
    where: { id: requestId },
  });

  if (!joinRequest || joinRequest.status !== "PENDING") {
    throw new Error("Join request not found or already reviewed.");
  }

  if (!(await canEditTournament(staffUser, joinRequest.tournamentId))) {
    throw new Error("You are not assigned to review this tournament.");
  }

  await prisma.tournamentJoinRequest.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
      staffNote: staffNote || null,
      reviewedById: staffUser.id,
      reviewedAt: new Date(),
    },
  });

  redirect(`/staff/tournaments/${joinRequest.tournamentId}/join-requests`);
}
