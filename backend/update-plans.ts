import { PrismaClient } from './src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.plan.updateMany({
    where: { OR: [{ name: { contains: 'Agent', mode: 'insensitive' } }, { name: { contains: 'listing', mode: 'insensitive' } }] },
    data: { targetAudience: 'AGENT' }
  });
  console.log('Updated');
}
main().catch(console.error).finally(() => prisma.$disconnect());
