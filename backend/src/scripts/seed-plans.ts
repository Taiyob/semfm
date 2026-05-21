import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is missing');

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-01-27.acacia' as any,
});

const plans = [
    {
        name: 'Free',
        description: 'Essential data for market explorers.',
        price: 0,
        features: [
            'Rent estimates',
            'Gross yield',
            'Properties overview',
            '5 saved listings (only if you make an account)',
            'No Property match alerts',
        ],
    },
    {
        name: 'Investor Basic',
        description: 'Deeper insights for active searchers.',
        price: 20,
        features: [
            'Net profit insights',
            'Sort by investor metrics',
            '20 saved listings',
            '1 match alert / month',
        ],
    },
    {
        name: 'Investor Pro',
        description: 'The strategy engine for professional investors.',
        price: 30,
        features: [
            'All calculator tools',
            'Compare up to 5 listings',
            'Portfolio simulator (up to 5 properties)',
            'Export to PDF',
            'Up to 15 match alerts',
        ],
    },
    {
        name: 'Investor Premium',
        description: 'Full portfolio intelligence platform.',
        price: 50,
        features: [
            'Everything from Free, Basic, and Pro',
            'Unlimited saved properties',
            'Portfolio simulator (up to 25 properties)',
            'Unlimited match alerts',
        ],
    },
    {
        name: 'Pay-per-listing',
        description: 'Post verified listings on demand.',
        price: 50,
        features: [
            'Verified listing placement',
            'Regional reach',
            'Basic lead notifications',
        ],
    },
    {
        name: 'Agent Unlimited',
        description: 'Scale your inventory without limits.',
        price: 200,
        features: [
            'Unlimited listings',
            'Up to 3 team members',
            'Basic analytics (views, leads)',
        ],
    },
    {
        name: 'Agent Pro',
        description: 'Professional-grade agency tools.',
        price: 350,
        features: [
            'Everything in Unlimited',
            '5 boosts/month (48 hours)',
            'Up to 10 team members',
            'Listing performance insights',
        ],
    },
    {
        name: 'Agent Premium',
        description: 'Full network dominance platform.',
        price: 500,
        features: [
            'Everything in Pro',
            '15 boosts/month (48 hours)',
            'Priority support',
            'Up to 20 team members',
            'Scheduled price changes',
            'Lead export (CSV)',
        ],
    },
];

async function seed() {
    console.log('🌱 Starting plan seeding...');

    for (const planData of plans) {
        try {
            console.log(`Processing plan: ${planData.name}`);

            // 0. Check if plan already exists in DB
            const existingPlan = await prisma.plan.findFirst({
                where: { name: planData.name }
            });

            if (existingPlan) {
                console.log(`⏭️ Plan ${planData.name} already exists, skipping...`);
                continue;
            }

            // 1. Create in Stripe
            let product;
            let price;

            if (planData.price > 0) {
                product = await stripe.products.create({
                    name: planData.name,
                    description: planData.description,
                    metadata: {
                        features: JSON.stringify(planData.features),
                    },
                });

                price = await stripe.prices.create({
                    product: product.id,
                    unit_amount: planData.price * 100,
                    currency: 'eur',
                    recurring: {
                        interval: 'month',
                    },
                });
                console.log(`Created Stripe Product/Price for ${planData.name}`);
            }

            // 2. Save to DB
            await prisma.plan.create({
                data: {
                    name: planData.name,
                    description: planData.description,
                    price: planData.price,
                    currency: 'eur',
                    interval: 'month',
                    features: planData.features,
                    stripeProductId: product?.id,
                    stripePriceId: price?.id,
                    isActive: true,
                },
            });

            console.log(`✅ Successfully seeded ${planData.name}`);
        } catch (error) {
            console.error(`❌ Failed to seed ${planData.name}:`, error);
        }
    }

    console.log('🏁 Seeding finished.');
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
