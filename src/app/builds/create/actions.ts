"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function getBuildType(stats: {
  attack: number;
  defense: number;
  stamina: number;
}) {
  const { attack, defense, stamina } = stats;

  const sorted = [attack, defense, stamina].sort((a, b) => b - a);

  if (sorted[0] - sorted[1] <= 2) return "Balance";
  if (attack >= defense && attack >= stamina) return "Attack";
  if (defense >= attack && defense >= stamina) return "Defense";
  return "Stamina";
}

export async function createBuild(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    redirect("/dashboard");
  }

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const visibility = String(formData.get("visibility") || "PUBLIC").trim();

  const bladeId = String(formData.get("bladeId") || "").trim();
  const ratchetId = String(formData.get("ratchetId") || "").trim();
  const bitId = String(formData.get("bitId") || "").trim();

  if (!title || !bladeId || !ratchetId || !bitId) {
    throw new Error("Title, blade, ratchet, and bit are required.");
  }

  const [blade, ratchet, bit] = await Promise.all([
    prisma.blade.findUnique({ where: { id: bladeId } }),
    prisma.ratchet.findUnique({ where: { id: ratchetId } }),
    prisma.bit.findUnique({ where: { id: bitId } }),
  ]);

  if (!blade || !ratchet || !bit) {
    throw new Error("One or more selected parts are invalid.");
  }

  const totalAttack = blade.attack + ratchet.attack + bit.attack;
  const totalDefense = blade.defense + ratchet.defense + bit.defense;
  const totalStamina = blade.stamina + ratchet.stamina + bit.stamina;

  const type = getBuildType({
    attack: totalAttack,
    defense: totalDefense,
    stamina: totalStamina,
  });

  await prisma.build.create({
    data: {
      title,
      type,
      description: description || null,
      visibility: visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC",
      userId: dbUser.id,
      bladeId,
      ratchetId,
      bitId,
    },
  });

  redirect("/dashboard");
}