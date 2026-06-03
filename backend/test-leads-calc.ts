import 'dotenv/config';
import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    const leads = await prisma.lead.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: {
            user: { select: { email: true, firstName: true } },
            property: { select: { title: true } },
            calculation: true
        }
    });

    console.log('--- Latest Leads with Calculations ---');
    for (const l of leads) {
        console.log(`\n=== Lead: ${l.id} ===`);
        console.log(`  User: ${l.user.firstName} (${l.user.email})`);
        console.log(`  Property: ${l.property.title}`);
        console.log(`  Status: ${l.status}`);
        console.log(`  calcId: ${l.calculationId}`);
        console.log(`  Has calculation object: ${!!l.calculation}`);
        if (l.calculation) {
            console.log(`  Calc name: ${l.calculation.name}`);
        }
        console.log(`  createdAt: ${l.createdAt}`);
        console.log(`  updatedAt: ${l.updatedAt}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
