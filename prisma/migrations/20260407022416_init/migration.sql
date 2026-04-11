/*
  Warnings:

  - You are about to drop the column `plan` on the `Client` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "machineName" TEXT,
    "backupName" TEXT,
    "lastBackupAt" DATETIME,
    "lastBackupError" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Client" ("backupName", "createdAt", "id", "lastBackupAt", "lastBackupError", "machineName", "name", "status") SELECT "backupName", "createdAt", "id", "lastBackupAt", "lastBackupError", "machineName", "name", "status" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
