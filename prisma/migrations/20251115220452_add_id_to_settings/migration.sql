-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "id" INTEGER NOT NULL DEFAULT 1,
ADD CONSTRAINT "Settings_pkey" PRIMARY KEY ("id");
