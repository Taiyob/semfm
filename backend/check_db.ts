import { PrismaClient } from './src/generated/prisma/client';

const prisma = new PrismaClient();

async function checkInvestments() {
  try {
    const investments = await prisma.investment.findMany({
      include: {
        user: {
          select: { firstName: true, email: true }
        }
      }
    });
    console.log('Total Investments in DB:', investments.length);
    console.log('Investments Details:', JSON.stringify(investments, null, 2));
  } catch (error) {
    console.error('Error checking investments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkInvestments();
