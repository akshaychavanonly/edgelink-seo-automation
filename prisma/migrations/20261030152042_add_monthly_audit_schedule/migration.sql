/*
  Warnings:

  - A unique constraint covering the columns `[clientId,scheduledPeriod]` on the table `Audit` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "scheduledPeriod" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Audit_clientId_scheduledPeriod_key" ON "Audit"("clientId", "scheduledPeriod");
