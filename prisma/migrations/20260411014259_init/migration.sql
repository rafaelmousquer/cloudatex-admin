-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'basic',
    "monthlyValue" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "includedGb" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "extraPricePerGb" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "machineName" TEXT,
    "backupName" TEXT,
    "lastBackupAt" TIMESTAMP(3),
    "lastBackupError" TEXT,
    "storageUsedBytes" BIGINT NOT NULL DEFAULT 0,
    "lastStorageUpdate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
