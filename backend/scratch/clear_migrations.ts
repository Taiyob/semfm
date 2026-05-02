import { PrismaClient } from '../src/generated/prisma/client';

async function clearMigrations() {
    const prisma = new PrismaClient();
    try {
        console.log('Clearing _prisma_migrations table...');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "_prisma_migrations" RESTART IDENTITY CASCADE');
        console.log('Successfully cleared migration history.');
    } catch (e) {
        console.error('Error clearing migrations:', e);
    } finally {
        await prisma.$disconnect();
    }
}

clearMigrations();
