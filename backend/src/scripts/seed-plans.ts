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
        description: 'Entry-level plan for users exploring investment opportunities and testing the platform.',
        price: 0,
        interval: 'month',
        stripeInterval: 'month',
        stripeIntervalCount: 1,
        features: [
            'Rent estimates',
            'Gross yield',
            'Basic property overview',
            'Up to 5 saved listings',
        ],
    },
    {
        name: 'Core',
        description: 'The main working tier for investors actively searching for opportunities.',
        price: 24.99,
        interval: '4 weeks',
        stripeInterval: 'week',
        stripeIntervalCount: 4,
        features: [
            'All investment calculators (Net Profit, ROI, Yield, Cashflow)',
            'Compare up to 5 listings',
            'Portfolio Simulator (up to 5 properties)',
            'Export analyses to PDF',
            'Up to 10 match alerts',
            'Up to 50 saved listings',
        ],
    },
    {
        name: 'Pro',
        description: 'Built for active investors who want to both find opportunities and manage their portfolio in one place.',
        price: 100,
        interval: '4 weeks',
        stripeInterval: 'week',
        stripeIntervalCount: 4,
        features: [
            'Property Management Lite',
            'Portfolio Simulator (up to 25 properties)',
            'Unlimited comparisons',
            'Unlimited exports',
            'Unlimited saved listings & match alerts',
            'Exclusive investor newsletter & tips',
        ],
    },
    {
        name: 'Pay-per-listing',
        description: 'Post verified listings on demand.',
        price: 50,
        interval: 'month',
        stripeInterval: 'month',
        stripeIntervalCount: 1,
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
        interval: 'month',
        stripeInterval: 'month',
        stripeIntervalCount: 1,
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
        interval: 'month',
        stripeInterval: 'month',
        stripeIntervalCount: 1,
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
        interval: 'month',
        stripeInterval: 'month',
        stripeIntervalCount: 1,
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

            let product;
            let price;

            if (existingPlan) {
                console.log(`🔄 Plan ${planData.name} exists, updating...`);
                await prisma.plan.update({
                    where: { id: existingPlan.id },
                    data: {
                        description: planData.description,
                        features: planData.features,
                        price: planData.price,
                        interval: planData.interval || 'month',
                    }
                });
                console.log(`✅ Successfully updated ${planData.name}`);
                continue;
            }

            // 1. Create in Stripe
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
                    unit_amount: Math.round(planData.price * 100),
                    currency: 'eur',
                    recurring: {
                        interval: (planData.stripeInterval || 'month') as any,
                        interval_count: planData.stripeIntervalCount || 1,
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
                    interval: planData.interval || 'month',
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
