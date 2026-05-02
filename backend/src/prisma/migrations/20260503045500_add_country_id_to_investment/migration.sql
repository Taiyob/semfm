-- AlterTable
ALTER TABLE "Investment" ADD COLUMN     "countryId" UUID;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;
