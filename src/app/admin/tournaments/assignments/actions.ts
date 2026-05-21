"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";

export async function setTournamentAssignments(formData: FormData) {
  const admin = await requireAdminUser();

  const tournamentId = String(formData.get("tournamentId") || "").trim();
  const employeeIds = formData.getAll("employeeIds").map((id) => String(id).trim());

  if (!tournamentId) {
    throw new Error("Tournament is required.");
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) {
    throw new Error("Tournament not found.");
  }

  const validEmployees = await prisma.user.findMany({
    where: { id: { in: employeeIds }, role: "EMPLOYEE" },
    select: { id: true },
  });

  const validIds = validEmployees.map((e) => e.id);

  await prisma.$transaction(async (tx) => {
    await tx.tournamentAssignment.deleteMany({
      where: { tournamentId },
    });

    if (validIds.length > 0) {
      await tx.tournamentAssignment.createMany({
        data: validIds.map((userId) => ({
          tournamentId,
          userId,
          assignedById: admin.id,
        })),
      });
    }
  });

  redirect(`/admin/tournaments/${tournamentId}/assignments`);
}
