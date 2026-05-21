"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";

export async function approveApplication(formData: FormData) {
  const admin = await requireAdminUser();
  const applicationId = String(formData.get("applicationId") || "").trim();

  if (!applicationId) throw new Error("Application id is required.");

  const application = await prisma.employeeApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application || application.status !== "PENDING") {
    throw new Error("Application not found or already reviewed.");
  }

  await prisma.$transaction([
    prisma.employeeApplication.update({
      where: { id: applicationId },
      data: {
        status: "APPROVED",
        reviewedById: admin.id,
        reviewedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: application.userId },
      data: { role: "EMPLOYEE" },
    }),
  ]);

  redirect("/admin/applications");
}

export async function rejectApplication(formData: FormData) {
  const admin = await requireAdminUser();
  const applicationId = String(formData.get("applicationId") || "").trim();
  const adminNote = String(formData.get("adminNote") || "").trim();

  if (!applicationId) throw new Error("Application id is required.");

  const application = await prisma.employeeApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application || application.status !== "PENDING") {
    throw new Error("Application not found or already reviewed.");
  }

  await prisma.employeeApplication.update({
    where: { id: applicationId },
    data: {
      status: "REJECTED",
      adminNote: adminNote || null,
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  redirect("/admin/applications");
}
