/**
 * Centralizes Clerk-to-database user synchronization, role checks, and route authorization helpers.
 */
import { auth, currentUser } from "@clerk/nextjs/server";
import { Role, User } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Staff: apply at /apply/employee, admin approves. Tournament edit requires assignment for EMPLOYEE.

/**
 * Returns whether the supplied role has staff-level access.
 */
export function isStaff(role: Role) {
  return role === "EMPLOYEE" || role === "ADMIN";
}

/**
 * Creates or updates the local database user for the currently authenticated Clerk account.
 */
export async function syncDbUser(clerkId: string): Promise<User | null> {
  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  const clerkUser = await currentUser();
  if (!clerkUser || clerkUser.id !== clerkId) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const username =
    clerkUser.username ||
    (email ? email.split("@")[0] : `user_${clerkUser.id.slice(0, 8)}`);

  return prisma.user.upsert({
    where: { clerkId },
    update: {
      email,
      username,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
    },
    create: {
      clerkId,
      email,
      username,
      firstName: clerkUser.firstName ?? null,
      lastName: clerkUser.lastName ?? null,
      role: "PLAYER",
    },
  });
}

/**
 * Requires a signed-in user and redirects when no matching database user can be loaded.
 */
export async function requireDbUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await syncDbUser(userId);
  if (!dbUser) redirect("/sign-in");

  return dbUser;
}

/**
 * Requires employee or admin access before allowing staff-only screens to render.
 */
export async function requireStaffUser() {
  const dbUser = await requireDbUser();

  if (!isStaff(dbUser.role)) {
    redirect("/dashboard");
  }

  return dbUser;
}

/**
 * Requires admin access before allowing privileged administration screens to render.
 */
export async function requireAdminUser() {
  const dbUser = await requireDbUser();

  if (dbUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return dbUser;
}

/**
 * Checks whether the user can edit the tournament as an admin or assigned employee.
 */
export async function canEditTournament(
  dbUser: Pick<User, "id" | "role">,
  tournamentId: string
): Promise<boolean> {
  if (dbUser.role === "ADMIN") {
    return true;
  }

  if (dbUser.role !== "EMPLOYEE") {
    return false;
  }

  const assignment = await prisma.tournamentAssignment.findUnique({
    where: {
      tournamentId_userId: {
        tournamentId,
        userId: dbUser.id,
      },
    },
  });

  return !!assignment;
}
