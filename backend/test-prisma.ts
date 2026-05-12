import { PrismaClient } from './src/generated/prisma/index.js';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Users found:', users.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
