/*
  Warnings:

  - The values [CLOSED] on the enum `LeadStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LeadStatus_new" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'VIEWING_SCHEDULED', 'OFFER_SUBMITTED', 'CLOSED_WON', 'CLOSED_LOST', 'ARCHIVED');
ALTER TABLE "public"."Lead" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Lead" ALTER COLUMN "status" TYPE "LeadStatus_new" USING ("status"::text::"LeadStatus_new");
ALTER TYPE "LeadStatus" RENAME TO "LeadStatus_old";
ALTER TYPE "LeadStatus_new" RENAME TO "LeadStatus";
DROP TYPE "public"."LeadStatus_old";
ALTER TABLE "Lead" ALTER COLUMN "status" SET DEFAULT 'NEW';
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;
