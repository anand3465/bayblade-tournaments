import { auth } from "@clerk/nextjs/server";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Assign EMPLOYEE or ADMIN in the database (see README). Players cannot mutate parts.

export function isStaff(role: Role) {
  return role === "EMPLOYEE" || role === "ADMIN";
}

export async function requireStaffUser() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser || !isStaff(dbUser.role)) {
    redirect("/dashboard");
  }

  return dbUser;
}
