-- AlterTable
ALTER TABLE "Client" ADD COLUMN "backupName" TEXT;
ALTER TABLE "Client" ADD COLUMN "lastBackupAt" DATETIME;
ALTER TABLE "Client" ADD COLUMN "lastBackupError" TEXT;
ALTER TABLE "Client" ADD COLUMN "machineName" TEXT;
