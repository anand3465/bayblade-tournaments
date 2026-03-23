import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  console.log("svix-id:", svixId);
  console.log("svix-timestamp:", svixTimestamp);
  console.log("svix-signature exists:", !!svixSignature);
  console.log("secret exists:", !!process.env.CLERK_WEBHOOK_SECRET);

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.log("Missing svix headers");
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.log("Missing webhook secret");
    return new NextResponse("Missing webhook secret", { status: 500 });
  }

  const wh = new Webhook(secret);

  let evt: any;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
    console.log("Webhook verified successfully");
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;
  const data = evt.data;

  if (eventType === "user.created" || eventType === "user.updated") {
    const email = data.email_addresses?.[0]?.email_address ?? "";
    const username =
      data.username ||
      (email ? email.split("@")[0] : `user_${data.id.slice(0, 8)}`);

    await prisma.user.upsert({
      where: { clerkId: data.id },
      update: {
        email,
        username,
        firstName: data.first_name ?? null,
        lastName: data.last_name ?? null,
      },
      create: {
        clerkId: data.id,
        email,
        username,
        firstName: data.first_name ?? null,
        lastName: data.last_name ?? null,
        role: "PLAYER",
      },
    });
  }

  if (eventType === "user.deleted" && data.id) {
    await prisma.user.deleteMany({
      where: { clerkId: data.id },
    });
  }

  console.log("WEBHOOK HIT:", evt.type);
  return NextResponse.json({ ok: true });
}