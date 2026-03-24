"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createTournament(formData: FormData) {
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

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const maxPlayers = Number(formData.get("maxPlayers"));
  const startDateRaw = String(formData.get("startDate") || "").trim();

  if (!title || !maxPlayers || !startDateRaw) {
    throw new Error("Title, max players, and start date are required.");
  }

  const tournament = await prisma.tournament.create({
    data: {
      title,
      description: description || null,
      location: location || null,
      maxPlayers,
      startDate: new Date(startDateRaw),
      createdById: dbUser.id,
    },
  });

  redirect(`/tournaments/${tournament.id}`);
}