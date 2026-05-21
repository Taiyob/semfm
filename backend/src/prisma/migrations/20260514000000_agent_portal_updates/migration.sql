-- AlterEnum
ALTER TYPE "LeadStatus" ADD VALUE 'QUALIFIED';
ALTER TYPE "LeadStatus" ADD VALUE 'VIEWING_SCHEDULED';
ALTER TYPE "LeadStatus" ADD VALUE 'OFFER_SUBMITTED';
ALTER TYPE "LeadStatus" ADD VALUE 'CLOSED_WON';
ALTER TYPE "LeadStatus" ADD VALUE 'CLOSED_LOST';
ALTER TYPE "LeadStatus" ADD VALUE 'ARCHIVED';

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "budget" TEXT,
ADD COLUMN     "financing" TEXT;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "bathrooms" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "estimatedRent" DOUBLE PRECISION,
ADD COLUMN     "exteriorSize" DOUBLE PRECISION,
ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "plotSize" DOUBLE PRECISION,
ADD COLUMN     "yearBuilt" INTEGER;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "planType",
ADD COLUMN     "planId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Plan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "interval" TEXT NOT NULL DEFAULT 'month',
    "features" JSONB NOT NULL DEFAULT '[]',
    "stripeProductId" TEXT,
    "stripePriceId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_stripeProductId_key" ON "Plan"("stripeProductId");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_stripePriceId_key" ON "Plan"("stripePriceId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
