/*
  Warnings:

  - You are about to drop the column `bit` on the `Build` table. All the data in the column will be lost.
  - You are about to drop the column `blade` on the `Build` table. All the data in the column will be lost.
  - You are about to drop the column `ratchet` on the `Build` table. All the data in the column will be lost.
  - Added the required column `bitId` to the `Build` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bladeId` to the `Build` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratchetId` to the `Build` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PartType" AS ENUM ('BLADE', 'RATCHET', 'BIT');

-- CreateEnum
CREATE TYPE "PartStatus" AS ENUM ('LEGAL', 'LIMITED', 'BANNED', 'UNRELEASED');

-- CreateEnum
CREATE TYPE "BuildStatus" AS ENUM ('LEGAL', 'WARNING', 'ILLEGAL');

-- AlterTable
ALTER TABLE "Build" DROP COLUMN "bit",
DROP COLUMN "blade",
DROP COLUMN "ratchet",
ADD COLUMN     "bitId" TEXT NOT NULL,
ADD COLUMN     "bladeId" TEXT NOT NULL,
ADD COLUMN     "ratchetId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Blade" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "stamina" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ratchet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "stamina" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ratchet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "stamina" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blade_name_key" ON "Blade"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ratchet_name_key" ON "Ratchet"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Bit_name_key" ON "Bit"("name");

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_bladeId_fkey" FOREIGN KEY ("bladeId") REFERENCES "Blade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_ratchetId_fkey" FOREIGN KEY ("ratchetId") REFERENCES "Ratchet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_bitId_fkey" FOREIGN KEY ("bitId") REFERENCES "Bit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
