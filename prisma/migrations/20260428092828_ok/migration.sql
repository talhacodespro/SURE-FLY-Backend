/*
  Warnings:

  - You are about to alter the column `balance` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `purchaseAmount` on the `Sale` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `companyAmount` on the `Sale` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - Added the required column `direction` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scope` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionScope" AS ENUM ('SALE', 'COMPANY', 'GENERAL');

-- CreateEnum
CREATE TYPE "TransactionDirection" AS ENUM ('CREDIT', 'DEBIT');

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "purchaseAmount" SET DATA TYPE INTEGER,
ALTER COLUMN "companyAmount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "direction" "TransactionDirection" NOT NULL,
ADD COLUMN     "scope" "TransactionScope" NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- DropEnum
DROP TYPE "ReferenceType";
