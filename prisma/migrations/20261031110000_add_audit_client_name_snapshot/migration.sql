-- AlterTable: add clientName snapshot column to Audit
ALTER TABLE "Audit" ADD COLUMN "clientName" TEXT NOT NULL DEFAULT '';

-- Backfill existing rows with the current client name
UPDATE "Audit" a
SET "clientName" = c."name"
FROM "Client" c
WHERE a."clientId" = c."id"
  AND a."clientName" = '';
