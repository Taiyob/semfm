import { BaseService } from '@/core/BaseService';
import { Plan } from '@/generated/prisma';
import Stripe from 'stripe';
import { config } from '@/core/config';
import { AppLogger } from '@/core/logging/logger';

export class PlanService extends BaseService<Plan> {
    private stripe: Stripe;

    constructor(prisma: any) {
        super(prisma, 'Plan');
        this.stripe = new Stripe(config.stripe.secretKey, {
            apiVersion: '2023-10-16' as any,
        });
    }

    protected getModel() {
        return this.prisma.plan;
    }

    /**
     * Create a plan in both Stripe and Database
     */
    async createPlan(data: {
        name: string;
        description?: string;
        price: number;
        currency?: string;
        interval?: 'month' | 'year';
        features?: string[];
    }): Promise<Plan> {
        try {
            AppLogger.info(`Creating plan in Stripe: ${data.name}`);

            // 1. Create Product in Stripe
            const product = await this.stripe.products.create({
                name: data.name,
                description: data.description,
                metadata: {
                    features: JSON.stringify(data.features || []),
                },
            });

            // 2. Create Price in Stripe
            const price = await this.stripe.prices.create({
                product: product.id,
                unit_amount: Math.round(data.price * 100),
                currency: data.currency || config.stripe.currency || 'eur',
                recurring: {
                    interval: data.interval || 'month',
                },
            });

            AppLogger.info(`Stripe Product/Price created: ${product.id} / ${price.id}`);

            // 3. Save to Database
            return await this.create({
                name: data.name,
                description: data.description,
                price: data.price,
                currency: data.currency || config.stripe.currency || 'eur',
                interval: data.interval || 'month',
                features: data.features || [],
                stripeProductId: product.id,
                stripePriceId: price.id,
                isActive: true,
            });
        } catch (error) {
            AppLogger.error('Failed to create plan in Stripe/DB', { error });
            throw error;
        }
    }

    /**
     * Update a plan (Metadata only in Stripe, as Prices are immutable)
     */
    async updatePlan(id: string, data: Partial<{
        name: string;
        description: string;
        features: string[];
        isActive: boolean;
    }>): Promise<Plan> {
        const plan = await this.findById(id);
        if (!plan) throw new Error('Plan not found');

        // Update Stripe Product if name or description changed
        if (plan.stripeProductId && (data.name || data.description || data.features)) {
            await this.stripe.products.update(plan.stripeProductId, {
                name: data.name,
                description: data.description,
                metadata: data.features ? { features: JSON.stringify(data.features) } : undefined,
            });
        }

        // Update DB
        return await this.updateById(id, data);
    }

    /**
     * Delete/Archive a plan
     */
    async deletePlan(id: string): Promise<Plan> {
        const plan = await this.findById(id);
        if (!plan) throw new Error('Plan not found');

        // Archive in Stripe
        if (plan.stripeProductId) {
            await this.stripe.products.update(plan.stripeProductId, { active: false });
        }

        // Mark as inactive in DB (Soft delete style)
        return await this.updateById(id, { isActive: false });
    }
}
