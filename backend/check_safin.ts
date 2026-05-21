import { PrismaClient } from './src/generated/prisma/index.js';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        where: { firstName: 'Safin' },
        include: { role: true }
    });
    console.log('Safin User:', JSON.stringify(user, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
