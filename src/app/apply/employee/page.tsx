/**
 * Renders the apply/employee route and loads the server data needed by that screen.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireDbUser } from "@/lib/auth";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import ApplicationForm, { type InitialEntry } from "./ApplicationForm";

/**
 * Converts an existing tournament registration into an application history entry.
 */
function registrationToEntry(reg: {
  id: string;
  tournament: {
    title: string;
    startDate: Date;
    location: string | null;
  };
}): InitialEntry {
  return {
    tournamentName: reg.tournament.title,
    eventDate: reg.tournament.startDate.toISOString(),
    location: reg.tournament.location ?? "",
    roleAtEvent: "PARTICIPANT",
    placementOrResult: "",
    organizerOrVenue: "",
    notes: "",
    isPlatformEvent: true,
    registrationId: reg.id,
  };
}

/**
 * Normalizes a saved application event so the form can reuse it as initial state.
 */
function applicationEntryToInitial(entry: {
  tournamentName: string;
  eventDate: Date;
  location: string | null;
  roleAtEvent: InitialEntry["roleAtEvent"];
  placementOrResult: string | null;
  organizerOrVenue: string | null;
  notes: string | null;
  isPlatformEvent: boolean;
  registrationId: string | null;
}): InitialEntry {
  return {
    tournamentName: entry.tournamentName,
    eventDate: entry.eventDate.toISOString(),
    location: entry.location ?? "",
    roleAtEvent: entry.roleAtEvent,
    placementOrResult: entry.placementOrResult ?? "",
    organizerOrVenue: entry.organizerOrVenue ?? "",
    notes: entry.notes ?? "",
    isPlatformEvent: entry.isPlatformEvent,
    registrationId: entry.registrationId ?? undefined,
  };
}

/**
 * Renders the apply employee page route with the data and access checks it requires.
 */
export default async function ApplyEmployeePage() {
  const syncedUser = await requireDbUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: syncedUser.id },
    include: {
      registrations: {
        include: { tournament: true },
        orderBy: { createdAt: "desc" },
      },
      employeeApplications: {
        where: { status: "PENDING" },
        take: 1,
      },
    },
  });

  if (!dbUser) {
    throw new Error("User profile could not be loaded.");
  }
  if (dbUser.role === "EMPLOYEE" || dbUser.role === "ADMIN") {
    redirect("/dashboard");
  }

  if (dbUser.employeeApplications.length > 0) {
    redirect("/dashboard");
  }

  const lastRejected = await prisma.employeeApplication.findFirst({
    where: { userId: dbUser.id, status: "REJECTED" },
    orderBy: { reviewedAt: "desc" },
    include: { tournamentEntries: true },
  });

  let initialEntries: InitialEntry[];

  if (lastRejected && lastRejected.tournamentEntries.length > 0) {
    initialEntries = lastRejected.tournamentEntries.map(applicationEntryToInitial);
  } else if (dbUser.registrations.length > 0) {
    initialEntries = dbUser.registrations.map(registrationToEntry);
  } else {
    initialEntries = [];
  }

  return (
    <PageShell>
      <Link
        href="/dashboard"
        className="inline-flex text-sm text-slate-400 hover:text-white"
      >
        ← Back to dashboard
      </Link>

      <SectionHeader
        eyebrow="Apply"
        title="Staff application"
        subtitle="Submit your cover letter and tournament history for admin review."
      />

      <ApplicationForm initialEntries={initialEntries} />
    </PageShell>
  );
}
