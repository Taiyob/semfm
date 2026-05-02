import { PrismaClient } from '../src/generated/prisma/client';

async function check() {
    const prisma = new PrismaClient();
    try {
        const count = await prisma.investment.count();
        const investments = await prisma.investment.findMany({
            include: { user: true }
        });
        console.log('--- DATABASE CHECK ---');
        console.log('Total Investments:', count);
        console.log('Investments Details:', JSON.stringify(investments, null, 2));
    } catch (e) {
        console.error('Error checking DB:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
