-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "calculationId" UUID;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_calculationId_fkey" FOREIGN KEY ("calculationId") REFERENCES "SavedCalculation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
