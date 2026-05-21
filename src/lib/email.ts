import { prisma } from "@/lib/prisma";

type ApplicationNotifyPayload = {
  applicationId: string;
  applicantUsername: string;
  applicantEmail: string;
  tournamentEntryCount: number;
};

export async function notifyAdminsOfNewApplication(
  payload: ApplicationNotifyPayload
) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const appUrl = process.env.APP_URL || "http://localhost:3000";

  if (!apiKey || !fromEmail) {
    return;
  }

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { email: true },
  });

  const notifyEmail = process.env.ADMIN_NOTIFY_EMAIL;
  const recipients = notifyEmail
    ? [notifyEmail]
    : admins.map((a) => a.email).filter(Boolean);

  if (recipients.length === 0) {
    return;
  }

  const reviewUrl = `${appUrl}/admin/applications/${payload.applicationId}`;

  const body = {
    from: fromEmail,
    to: recipients,
    subject: `New staff application: ${payload.applicantUsername}`,
    html: `
      <p><strong>${payload.applicantUsername}</strong> (${payload.applicantEmail}) applied to become staff.</p>
      <p>Tournament history entries: ${payload.tournamentEntryCount}</p>
      <p><a href="${reviewUrl}">Review application</a></p>
    `,
  };

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
