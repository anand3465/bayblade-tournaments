-- CreateEnum
CREATE TYPE "TournamentJoinRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "TournamentJoinRequest" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "experience" TEXT,
    "preferredBuild" TEXT,
    "status" "TournamentJoinRequestStatus" NOT NULL DEFAULT 'PENDING',
    "staffNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "reviewedById" TEXT,

    CONSTRAINT "TournamentJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TournamentJoinRequest_userId_tournamentId_key" ON "TournamentJoinRequest"("userId", "tournamentId");

-- CreateIndex
CREATE INDEX "TournamentJoinRequest_status_idx" ON "TournamentJoinRequest"("status");

-- CreateIndex
CREATE INDEX "TournamentJoinRequest_tournamentId_status_idx" ON "TournamentJoinRequest"("tournamentId", "status");

-- AddForeignKey
ALTER TABLE "TournamentJoinRequest" ADD CONSTRAINT "TournamentJoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentJoinRequest" ADD CONSTRAINT "TournamentJoinRequest_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentJoinRequest" ADD CONSTRAINT "TournamentJoinRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
