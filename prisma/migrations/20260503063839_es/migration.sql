/*
  Warnings:

  - The values [INCOME] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `scope` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('INVOICE', 'PAYMENT', 'EXPENSE', 'REFUND', 'TRANSFER', 'ADJUSTMENT');
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "public"."TransactionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "scope";

-- DropEnum
DROP TYPE "TransactionScope";
