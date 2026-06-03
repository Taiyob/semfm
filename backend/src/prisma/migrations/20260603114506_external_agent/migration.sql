-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "externalContactEmail" TEXT,
ADD COLUMN     "externalContactName" TEXT,
ADD COLUMN     "externalContactPhone" TEXT,
ADD COLUMN     "externalListingUrl" TEXT,
ADD COLUMN     "isAgentRegistered" BOOLEAN NOT NULL DEFAULT true;
