/*
  Warnings:

  - You are about to drop the column `is_enabled` on the `enabled_channels` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "enabled_channels" DROP COLUMN "is_enabled";
