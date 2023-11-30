/*
  Warnings:

  - You are about to drop the column `location` on the `ParkingSpace` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `ParkingSpace` table. All the data in the column will be lost.
  - The `disponibility` column on the `ParkingSpace` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentStatus` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `latitude` to the `ParkingSpace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `ParkingSpace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ParkingSpace` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ParkingSpaceType" AS ENUM ('Moto', 'Carro');

-- CreateEnum
CREATE TYPE "ReservationPaymentStatus" AS ENUM ('Cancelado', 'Aprovado', 'Pendente');

-- AlterTable
ALTER TABLE "ParkingSpace" DROP COLUMN "location",
DROP COLUMN "picture",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "type" "ParkingSpaceType" NOT NULL,
DROP COLUMN "disponibility",
ADD COLUMN     "disponibility" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "ReservationPaymentStatus" NOT NULL DEFAULT 'Pendente';

-- CreateTable
CREATE TABLE "Picture" (
    "id" VARCHAR(36) NOT NULL,
    "parkingSpaceId" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Picture" ADD CONSTRAINT "Picture_parkingSpaceId_fkey" FOREIGN KEY ("parkingSpaceId") REFERENCES "ParkingSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
