import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    const subscriptions = await prisma.subscription.findMany({
        include: {
            user: { select: { email: true } },
            plan: { select: { name: true } }
        }
    });

    console.log('--- Subscriptions in DB ---');
    console.table(subscriptions.map(s => ({
        id: s.id,
        email: s.user.email,
        plan: s.plan.name,
        status: s.status,
        stripeId: s.stripeSubscriptionId
    })));

    const users = await prisma.user.findMany({
        select: { email: true, id: true }
    });
    console.log('\n--- Users in DB ---');
    console.table(users);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
