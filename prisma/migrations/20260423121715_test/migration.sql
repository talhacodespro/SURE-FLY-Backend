/*
  Warnings:

  - The values [PASSPORT,VISA,OTHERS] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdBy` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `credit` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `debit` on the `Company` table. All the data in the column will be lost.
  - You are about to alter the column `balance` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the column `createdBy` on the `Passport` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Sale` table. All the data in the column will be lost.
  - You are about to alter the column `purchaseAmount` on the `Sale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `companyAmount` on the `Sale` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to drop the column `action` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Transaction` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Passport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Sale` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `purchaseFromId` on table `Sale` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `createdById` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('ACTIVE', 'USED', 'CANCELLED', 'REFUNDED', 'VOID', 'REISSUED', 'TRANSFERRED');

-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('TICKET', 'VISA');

-- CreateEnum
CREATE TYPE "ReferenceType" AS ENUM ('SALE', 'COMPANY', 'NONE');

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER', 'PAYMENT', 'REFUND', 'ADJUSTMENT');
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "public"."TransactionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Passport" DROP CONSTRAINT "Passport_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_createdBy_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "createdBy",
DROP COLUMN "credit",
DROP COLUMN "debit",
ADD COLUMN     "createdById" INTEGER NOT NULL,
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Passport" DROP COLUMN "createdBy",
ADD COLUMN     "createdById" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "createdBy",
ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "SaleType" NOT NULL,
ALTER COLUMN "purchaseFromId" SET NOT NULL,
ALTER COLUMN "purchaseAmount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "companyAmount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "action",
ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "createdBy",
ADD COLUMN     "companyId" INTEGER,
ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "saleId" INTEGER,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- DropEnum
DROP TYPE "TicketAction";

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Passport" ADD CONSTRAINT "Passport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_purchaseFromId_fkey" FOREIGN KEY ("purchaseFromId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
