import { Request, Response, NextFunction } from 'express';
import { BaseController } from '@/core/BaseController';
import { SubscriptionService } from './subscription.service';
import { catchAsync } from '@/utils/catchAsync';

export class SubscriptionController extends BaseController {
    constructor(private subscriptionService: SubscriptionService) {
        super();
    }

    /**
     * Stripe Webhook Handler
     */
    public handleWebhook = catchAsync(async (req: Request, res: Response) => {
        const signature = req.headers['stripe-signature'] as string;
        const rawBody = (req as any).rawBody;

        if (!signature || !rawBody) {
            return res.status(400).json({ success: false, message: 'Missing stripe signature or raw body' });
        }

        const result = await this.subscriptionService.handleWebhook(signature, rawBody);
        return res.status(200).send(result);
    });

    /**
     * Create Checkout Session
     */
    public createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
        const { planId } = req.body;
        const userId = (req as any).user.id;
        const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;
        
        const result = await this.subscriptionService.createCheckoutSession(userId, planId, origin);
        return this.sendResponse(req, res, 'Checkout session created successfully', undefined, result);
    });

    /**
     * Create Customer Portal Session
     */
    public createPortalSession = catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;
        
        const result = await this.subscriptionService.createPortalSession(userId, origin);
        return this.sendResponse(req, res, 'Portal session created successfully', undefined, result);
    });
}
