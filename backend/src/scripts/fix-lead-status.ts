import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Database Status Fix ---');
  try {
    // We use raw query because the generated types might not have 'CLOSED' anymore
    const result = await prisma.$executeRawUnsafe(
      `UPDATE "Lead" SET status = 'CLOSED_WON' WHERE status = 'CLOSED'`
    );
    console.log(`Successfully updated ${result} leads from CLOSED to CLOSED_WON.`);
  } catch (error) {
    console.error('Error updating leads:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
