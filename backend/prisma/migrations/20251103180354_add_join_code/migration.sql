/*
  Warnings:

  - A unique constraint covering the columns `[joinCode]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Group` ADD COLUMN `joinCode` VARCHAR(191) NULL;

-- Update existing groups with unique join codes
UPDATE `Group` SET `joinCode` = CONCAT('GRP', LPAD(id, 5, '0')) WHERE `joinCode` IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Group_joinCode_key` ON `Group`(`joinCode`);

