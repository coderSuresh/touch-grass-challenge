-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('MONTH', 'WEEK');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ChallengeCategory" AS ENUM ('NATURE', 'WALKING', 'EXPLORATION', 'PHOTOGRAPHY', 'RUNNING', 'CULTURE', 'WILDLIFE', 'FOOD', 'WELLNESS', 'OTHER');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MODERATE', 'ADVENTUROUS');

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "periodType" "PeriodType" NOT NULL DEFAULT 'MONTH',
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "season" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "preferences" JSONB NOT NULL,
    "target" INTEGER NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ChallengeCategory" NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reflection" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reflection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Plan_status_year_month_idx" ON "Plan"("status", "year", "month");
CREATE INDEX "Challenge_planId_weekNumber_idx" ON "Challenge"("planId", "weekNumber");
CREATE UNIQUE INDEX "Reflection_planId_key" ON "Reflection"("planId");

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Reflection" ADD CONSTRAINT "Reflection_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
