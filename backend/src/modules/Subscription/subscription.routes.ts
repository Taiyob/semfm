import { Router } from 'express';
import { SubscriptionController } from './subscription.controller';
import { authMiddleware } from '@/middleware/authMiddleware';

export class SubscriptionRoutes {
    private router: Router;

    constructor(private subscriptionController: SubscriptionController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Webhook MUST be public and should not have CSRF/Auth (Stripe calls it)
        this.router.post('/webhook', this.subscriptionController.handleWebhook);

        // Checkout session requires authentication
        this.router.post('/create-checkout-session', authMiddleware, this.subscriptionController.createCheckoutSession);
        
        // Customer portal session requires authentication
        this.router.post('/create-portal-session', authMiddleware, this.subscriptionController.createPortalSession);
    }

    public getRouter(): Router {
        return this.router;
    }
}
