/**
 * Defines the API handler for the api/health endpoint.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Handles health-check requests and returns the current service status.
 */
export async function GET() {
  const userCount = await prisma.user.count();

  return NextResponse.json({
    ok: true,
    userCount,
  });
}
