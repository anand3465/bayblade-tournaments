-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ApplicationEventRole" AS ENUM ('PARTICIPANT', 'VOLUNTEER', 'ORGANIZER', 'OTHER');

-- CreateTable
CREATE TABLE "TournamentAssignment" (
    "id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tournamentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedById" TEXT,

    CONSTRAINT "TournamentAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeApplication" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "experience" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "reviewedById" TEXT,

    CONSTRAINT "EmployeeApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationTournamentEntry" (
    "id" TEXT NOT NULL,
    "tournamentName" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "roleAtEvent" "ApplicationEventRole" NOT NULL,
    "placementOrResult" TEXT,
    "organizerOrVenue" TEXT,
    "notes" TEXT,
    "isPlatformEvent" BOOLEAN NOT NULL DEFAULT false,
    "applicationId" TEXT NOT NULL,
    "registrationId" TEXT,

    CONSTRAINT "ApplicationTournamentEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TournamentAssignment_tournamentId_userId_key" ON "TournamentAssignment"("tournamentId", "userId");

-- CreateIndex
CREATE INDEX "EmployeeApplication_status_idx" ON "EmployeeApplication"("status");

-- CreateIndex
CREATE INDEX "EmployeeApplication_userId_idx" ON "EmployeeApplication"("userId");

-- AddForeignKey
ALTER TABLE "TournamentAssignment" ADD CONSTRAINT "TournamentAssignment_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentAssignment" ADD CONSTRAINT "TournamentAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentAssignment" ADD CONSTRAINT "TournamentAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeApplication" ADD CONSTRAINT "EmployeeApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeApplication" ADD CONSTRAINT "EmployeeApplication_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationTournamentEntry" ADD CONSTRAINT "ApplicationTournamentEntry_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "EmployeeApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationTournamentEntry" ADD CONSTRAINT "ApplicationTournamentEntry_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
