-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'basic',
    "monthlyValue" REAL NOT NULL DEFAULT 30,
    "includedGb" REAL NOT NULL DEFAULT 5,
    "extraPricePerGb" REAL NOT NULL DEFAULT 2,
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "machineName" TEXT,
    "backupName" TEXT,
    "lastBackupAt" DATETIME,
    "lastBackupError" TEXT,
    "storageUsedBytes" BIGINT NOT NULL DEFAULT 0,
    "lastStorageUpdate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Client" ("backupName", "createdAt", "email", "extraPricePerGb", "id", "includedGb", "lastBackupAt", "lastBackupError", "machineName", "monthlyValue", "name", "plan", "status") SELECT "backupName", "createdAt", "email", "extraPricePerGb", "id", "includedGb", "lastBackupAt", "lastBackupError", "machineName", "monthlyValue", "name", "plan", "status" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
