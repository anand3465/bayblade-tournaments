/*
  Warnings:

  - You are about to drop the column `speed` on the `Blade` table. All the data in the column will be lost.
  - Added the required column `category` to the `Blade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spin` to the `Blade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blade" DROP COLUMN "speed",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "spin" TEXT NOT NULL,
ADD COLUMN     "width" DOUBLE PRECISION,
ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION;
