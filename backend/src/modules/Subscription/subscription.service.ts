import { BaseService } from '@/core/BaseService';
import { Subscription } from '@/generated/prisma';
import Stripe from 'stripe';
import { config } from '@/core/config';
import { AppLogger } from '@/core/logging/logger';

export class SubscriptionService extends BaseService<Subscription> {
    private stripe: Stripe;

    constructor(prisma: any) {
        super(prisma, 'Subscription');
        this.stripe = new Stripe(config.stripe.secretKey, {
            apiVersion: '2023-10-16' as any,
        });
    }

    protected getModel() {
        return this.prisma.subscription;
    }

    /**
     * Handle Stripe Webhook Events
     */
    async handleWebhook(signature: string, rawBody: any) {
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                rawBody,
                signature,
                config.stripe.webhookSecret
            );
        } catch (err: any) {
            AppLogger.error(`Webhook signature verification failed: ${err.message}`);
            throw new Error(`Webhook Error: ${err.message}`);
        }

        AppLogger.info(`🔔 Received Stripe Event: ${event.type}`);

        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
                break;
            case 'customer.subscription.deleted':
                await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;
            case 'customer.subscription.updated':
                await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                break;
            case 'invoice.payment_succeeded':
                await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
                break;
            default:
                AppLogger.info(`Unhandled event type ${event.type}`);
        }

        return { received: true };
    }

    private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
        const metadata = session.metadata;
        if (!metadata || !metadata.userId || !metadata.planId) {
            AppLogger.error('Missing metadata in checkout session');
            return;
        }

        AppLogger.info(`✅ Payment success for User: ${metadata.userId}, Plan: ${metadata.planId}`);

        // Deactivate any existing active subscriptions for this user to prevent duplicates
        await this.prisma.subscription.updateMany({
            where: {
                userId: metadata.userId,
                status: 'ACTIVE',
                NOT: { stripeSubscriptionId: session.subscription as string }
            },
            data: { status: 'CANCELED' }
        });

        // Update or Create subscription in DB
        await this.prisma.subscription.upsert({
            where: { stripeSubscriptionId: session.subscription as string },
            update: {
                status: 'ACTIVE',
                planId: metadata.planId, // Ensure planId is updated if it already existed
            },
            create: {
                userId: metadata.userId,
                planId: metadata.planId,
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                status: 'ACTIVE',
            },
        });
        AppLogger.info(`Subscription record upserted for ${session.subscription}`);
    }

    private async handleSubscriptionDeleted(subscription: any) {
        AppLogger.info(`❌ Subscription canceled: ${subscription.id}`);
        await this.prisma.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: { status: 'CANCELED' },
        });
    }

    private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
        AppLogger.info(`🔄 Subscription updated event received: ${subscription.id} | Customer: ${subscription.customer}`);
        
        const stripePriceId = subscription.items.data[0]?.price?.id;
        if (!stripePriceId) {
            AppLogger.warn(`No price ID found in subscription update for ${subscription.id}`);
            return;
        }

        const plan = await this.prisma.plan.findFirst({ where: { stripePriceId } });
        if (!plan) {
            AppLogger.error(`CRITICAL: Plan not found for stripePriceId: ${stripePriceId}. Update skipped.`);
            return;
        }

        try {
            // First attempt: Update by stripeSubscriptionId
            const updateResult = await this.prisma.subscription.updateMany({
                where: { stripeSubscriptionId: subscription.id },
                data: {
                    planId: plan.id,
                    status: subscription.status.toUpperCase() as any,
                    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                },
            });

            // If no record was updated by subscription ID, try falling back to Customer ID
            if (updateResult.count === 0) {
                const customerId = typeof subscription.customer === 'string' ? subscription.customer : (subscription.customer as any).id;
                AppLogger.warn(`No record found with stripeSubscriptionId: ${subscription.id}. Falling back to stripeCustomerId: ${customerId}`);
                
                await this.prisma.subscription.updateMany({
                    where: { stripeCustomerId: customerId },
                    data: {
                        stripeSubscriptionId: subscription.id,
                        planId: plan.id,
                        status: subscription.status.toUpperCase() as any,
                        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
                    },
                });
            }
            
            AppLogger.info(`✅ Subscription record synchronized successfully for ${subscription.id}`);
        } catch (error: any) {
            AppLogger.error(`Failed to synchronize subscription record: ${error.message}`);
        }
    }

    private async handleInvoicePaymentSucceeded(invoice: any) {
        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        if (!subId) return;

        AppLogger.info(`💰 Invoice payment succeeded for subscription: ${subId}`);

        // Fetch the subscription details from Stripe to get the current plan
        const subscription = await this.stripe.subscriptions.retrieve(subId);
        await this.handleSubscriptionUpdated(subscription);
    }

    /**
     * Create a Checkout Session
     */
    async createCheckoutSession(userId: string, planId: string, origin: string) {
        const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
        if (!plan) throw new Error('Plan not found');

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: plan.stripePriceId!,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/pricing/checkout?success=true`,
            cancel_url: `${origin}/pricing`,
            metadata: {
                userId,
                planId,
            },
        });

        return { url: session.url };
    }

    /**
     * Create a Customer Portal Session
     */
    async createPortalSession(userId: string, origin: string) {
        const subscription = await this.prisma.subscription.findFirst({
            where: { userId, status: 'ACTIVE' },
        });

        if (!subscription || !subscription.stripeCustomerId) {
            throw new Error('No active subscription found for this user');
        }

        const session = await this.stripe.billingPortal.sessions.create({
            customer: subscription.stripeCustomerId,
            return_url: `${origin}/pricing`,
        });

        return { url: session.url };
    }
}
