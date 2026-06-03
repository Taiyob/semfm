import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    const leads = await prisma.lead.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: {
            user: { select: { email: true, firstName: true } },
            property: { select: { title: true } }
        }
    });

    console.log('--- Latest Leads in DB ---');
    console.table(leads.map(l => ({
        id: l.id,
        user: l.user.firstName,
        property: l.property.title,
        status: l.status,
        calcId: l.calculationId,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt
    })));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
