"use server";

import { ApplicationEventRole } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notifyAdminsOfNewApplication } from "@/lib/email";

const validRoles: ApplicationEventRole[] = [
  "PARTICIPANT",
  "VOLUNTEER",
  "ORGANIZER",
  "OTHER",
];

export type TournamentEntryInput = {
  tournamentName: string;
  eventDate: string;
  location?: string;
  roleAtEvent: ApplicationEventRole;
  placementOrResult?: string;
  organizerOrVenue?: string;
  notes?: string;
  isPlatformEvent?: boolean;
  registrationId?: string;
};

export async function submitEmployeeApplication(formData: FormData) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) redirect("/sign-in");
  if (dbUser.role === "EMPLOYEE" || dbUser.role === "ADMIN") {
    redirect("/dashboard");
  }

  const pending = await prisma.employeeApplication.findFirst({
    where: { userId: dbUser.id, status: "PENDING" },
  });

  if (pending) {
    throw new Error("You already have a pending application.");
  }

  const message = String(formData.get("message") || "").trim();
  const experience = String(formData.get("experience") || "").trim();
  const entriesJson = String(formData.get("tournamentEntries") || "[]");

  if (message.length < 20) {
    throw new Error("Please write at least 20 characters explaining why you want to join staff.");
  }

  let entries: TournamentEntryInput[];
  try {
    entries = JSON.parse(entriesJson) as TournamentEntryInput[];
  } catch {
    throw new Error("Invalid tournament history data.");
  }

  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error("Add at least one tournament to your history.");
  }

  const parsedEntries = entries.map((entry, index) => {
    const tournamentName = String(entry.tournamentName || "").trim();
    const eventDateRaw = String(entry.eventDate || "").trim();
    const roleAtEvent = String(entry.roleAtEvent || "").trim() as ApplicationEventRole;

    if (!tournamentName || !eventDateRaw) {
      throw new Error(`Tournament #${index + 1}: name and date are required.`);
    }

    if (!validRoles.includes(roleAtEvent)) {
      throw new Error(`Tournament #${index + 1}: invalid role.`);
    }

    const eventDate = new Date(eventDateRaw);
    if (Number.isNaN(eventDate.getTime())) {
      throw new Error(`Tournament #${index + 1}: invalid date.`);
    }

    return {
      tournamentName,
      eventDate,
      location: String(entry.location || "").trim() || null,
      roleAtEvent,
      placementOrResult: String(entry.placementOrResult || "").trim() || null,
      organizerOrVenue: String(entry.organizerOrVenue || "").trim() || null,
      notes: String(entry.notes || "").trim() || null,
      isPlatformEvent: Boolean(entry.isPlatformEvent),
      registrationId: entry.registrationId?.trim() || null,
    };
  });

  const application = await prisma.employeeApplication.create({
    data: {
      userId: dbUser.id,
      message,
      experience: experience || null,
      tournamentEntries: {
        create: parsedEntries.map((e) => ({
          tournamentName: e.tournamentName,
          eventDate: e.eventDate,
          location: e.location,
          roleAtEvent: e.roleAtEvent,
          placementOrResult: e.placementOrResult,
          organizerOrVenue: e.organizerOrVenue,
          notes: e.notes,
          isPlatformEvent: e.isPlatformEvent,
          registrationId: e.registrationId,
        })),
      },
    },
    include: {
      _count: { select: { tournamentEntries: true } },
    },
  });

  await notifyAdminsOfNewApplication({
    applicationId: application.id,
    applicantUsername: dbUser.username,
    applicantEmail: dbUser.email,
    tournamentEntryCount: application._count.tournamentEntries,
  });

  redirect("/dashboard");
}
