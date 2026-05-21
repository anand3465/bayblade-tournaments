"use server";

import { TournamentStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaffUser } from "@/lib/auth";

const validStatuses: TournamentStatus[] = ["UPCOMING", "ACTIVE", "COMPLETED"];

export async function updateTournament(formData: FormData) {
  await requireStaffUser();

  const tournamentId = String(formData.get("tournamentId") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const maxPlayers = Number(formData.get("maxPlayers"));
  const startDateRaw = String(formData.get("startDate") || "").trim();
  const status = String(formData.get("status") || "").trim() as TournamentStatus;

  if (!tournamentId || !title || !maxPlayers || !startDateRaw) {
    throw new Error("Title, max players, and start date are required.");
  }

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid tournament status.");
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      _count: {
        select: { registrations: true },
      },
    },
  });

  if (!tournament) {
    throw new Error("Tournament not found.");
  }

  if (maxPlayers < tournament._count.registrations) {
    throw new Error(
      `Max players cannot be less than current registrations (${tournament._count.registrations}).`
    );
  }

  await prisma.tournament.update({
    where: { id: tournamentId },
    data: {
      title,
      description: description || null,
      location: location || null,
      maxPlayers,
      startDate: new Date(startDateRaw),
      status,
    },
  });

  redirect(`/tournaments/${tournamentId}`);
}
