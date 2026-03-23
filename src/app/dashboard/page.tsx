import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not signed in</div>;
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">Email: {dbUser?.email}</p>
      <p>Role: {dbUser?.role}</p>
    </main>
  );
}