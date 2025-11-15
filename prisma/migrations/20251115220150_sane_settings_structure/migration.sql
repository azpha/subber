/*
  Warnings:

  - You are about to drop the column `name` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Settings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[discordWebhook]` on the table `Settings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `budget` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discordWebhook` to the `Settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ntfyWebhook` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Settings_name_key";

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "name",
DROP COLUMN "value",
ADD COLUMN     "budget" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "discordWebhook" TEXT NOT NULL,
ADD COLUMN     "ntfyWebhook" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Settings_discordWebhook_key" ON "Settings"("discordWebhook");
