/*
  Warnings:

  - You are about to drop the column `attendees` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `maxAttendees` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "attendees",
DROP COLUMN "maxAttendees",
DROP COLUMN "price";
