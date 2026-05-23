/**
 * Provides server actions for the staff/parts workflow, including validation, persistence, and cache refreshes.
 */
"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaffUser } from "@/lib/auth";

export type PartType = "blade" | "ratchet" | "bit";

/**
 * Parses a required integer form field and throws a clear validation error when invalid.
 */
function parseIntField(value: FormDataEntryValue | null, label: string) {
  const n = Number(String(value ?? "").trim());
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    throw new Error(`${label} must be a whole number.`);
  }
  return n;
}

/**
 * Parses an optional numeric form field while preserving empty values as null.
 */
function parseOptionalFloat(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new Error("Invalid number.");
  }
  return n;
}

/**
 * Trims optional text fields and stores blank values as null.
 */
function parseOptionalString(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  return raw || null;
}

/**
 * Builds the validated payload used when creating or updating blade records.
 */
function parseBladeFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const spin = String(formData.get("spin") || "").trim();

  if (!name || !category || !spin) {
    throw new Error("Name, category, and spin are required.");
  }

  return {
    name,
    category,
    spin,
    attack: parseIntField(formData.get("attack"), "Attack"),
    defense: parseIntField(formData.get("defense"), "Defense"),
    stamina: parseIntField(formData.get("stamina"), "Stamina"),
    weight: parseOptionalFloat(formData.get("weight")),
    height: parseOptionalFloat(formData.get("height")),
    width: parseOptionalFloat(formData.get("width")),
    description: parseOptionalString(formData.get("description")),
  };
}

/**
 * Builds the validated payload shared by ratchet and bit create/update actions.
 */
function parseRatchetOrBitFields(formData: FormData) {
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    throw new Error("Name is required.");
  }

  return {
    name,
    attack: parseIntField(formData.get("attack"), "Attack"),
    defense: parseIntField(formData.get("defense"), "Defense"),
    stamina: parseIntField(formData.get("stamina"), "Stamina"),
    weight: parseIntField(formData.get("weight"), "Weight"),
    speed: parseIntField(formData.get("speed"), "Speed"),
    description: parseOptionalString(formData.get("description")),
  };
}

/**
 * Turns Prisma unique-name conflicts into user-facing validation errors.
 */
function handleUniqueNameError(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  ) {
    throw new Error("A part with this name already exists.");
  }
  throw error;
}

/**
 * Server action that handles the create blade workflow and refreshes affected routes.
 */
export async function createBlade(formData: FormData) {
  await requireStaffUser();
  const data = parseBladeFields(formData);

  try {
    const blade = await prisma.blade.create({ data });
    redirect(`/staff/parts/${blade.id}/edit?type=blade`);
  } catch (error) {
    handleUniqueNameError(error);
  }
}

/**
 * Server action that handles the update blade workflow and refreshes affected routes.
 */
export async function updateBlade(formData: FormData) {
  await requireStaffUser();
  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Part id is required.");

  const data = parseBladeFields(formData);

  try {
    await prisma.blade.update({ where: { id }, data });
    redirect("/staff/parts");
  } catch (error) {
    handleUniqueNameError(error);
  }
}

/**
 * Server action that handles the create ratchet workflow and refreshes affected routes.
 */
export async function createRatchet(formData: FormData) {
  await requireStaffUser();
  const data = parseRatchetOrBitFields(formData);

  try {
    const ratchet = await prisma.ratchet.create({ data });
    redirect(`/staff/parts/${ratchet.id}/edit?type=ratchet`);
  } catch (error) {
    handleUniqueNameError(error);
  }
}

/**
 * Server action that handles the update ratchet workflow and refreshes affected routes.
 */
export async function updateRatchet(formData: FormData) {
  await requireStaffUser();
  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Part id is required.");

  const data = parseRatchetOrBitFields(formData);

  try {
    await prisma.ratchet.update({ where: { id }, data });
    redirect("/staff/parts");
  } catch (error) {
    handleUniqueNameError(error);
  }
}

/**
 * Server action that handles the create bit workflow and refreshes affected routes.
 */
export async function createBit(formData: FormData) {
  await requireStaffUser();
  const data = parseRatchetOrBitFields(formData);

  try {
    const bit = await prisma.bit.create({ data });
    redirect(`/staff/parts/${bit.id}/edit?type=bit`);
  } catch (error) {
    handleUniqueNameError(error);
  }
}

/**
 * Server action that handles the update bit workflow and refreshes affected routes.
 */
export async function updateBit(formData: FormData) {
  await requireStaffUser();
  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Part id is required.");

  const data = parseRatchetOrBitFields(formData);

  try {
    await prisma.bit.update({ where: { id }, data });
    redirect("/staff/parts");
  } catch (error) {
    handleUniqueNameError(error);
  }
}
