-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('PENDING', 'FINISHED', 'DNF');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "status" "ParticipantStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "wods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wods_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "wod_activities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "wodId" TEXT NOT NULL,
    CONSTRAINT "wod_activities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "results" (
    "id" TEXT NOT NULL,
    "score" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "status" "ResultStatus" NOT NULL DEFAULT 'PENDING',
    "wodId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE INDEX "participants_lastName_firstName_idx" ON "participants"("lastName", "firstName");
CREATE INDEX "wods_date_idx" ON "wods"("date");
CREATE INDEX "wod_activities_wodId_position_idx" ON "wod_activities"("wodId", "position");
CREATE INDEX "results_participantId_idx" ON "results"("participantId");
CREATE INDEX "results_wodId_points_idx" ON "results"("wodId", "points");
CREATE UNIQUE INDEX "results_wodId_participantId_key" ON "results"("wodId", "participantId");

ALTER TABLE "wod_activities" ADD CONSTRAINT "wod_activities_wodId_fkey"
FOREIGN KEY ("wodId") REFERENCES "wods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "results" ADD CONSTRAINT "results_wodId_fkey"
FOREIGN KEY ("wodId") REFERENCES "wods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "results" ADD CONSTRAINT "results_participantId_fkey"
FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
