import { Request, Response } from 'express';
import { NewsletterService } from './newsletter.service';
import { AppLogger } from '@/core/logging/logger';
import { HTTPStatusCode } from '@/types/HTTPStatusCode';

export class NewsletterController {
    constructor(private newsletterService: NewsletterService) {}

    public subscribe = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, markets = [], topics = [] } = req.body;

            if (!email) {
                res.status(HTTPStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: 'Email is required'
                });
                return;
            }

            const subscriber = await this.newsletterService.subscribe(email, markets, topics);

            res.status(HTTPStatusCode.CREATED).json({
                success: true,
                message: 'Subscribed successfully',
                data: subscriber
            });
        } catch (error) {
            AppLogger.error('Error subscribing to newsletter:', { error });
            res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public getAllSubscribers = async (req: Request, res: Response): Promise<void> => {
        try {
            const subscribers = await this.newsletterService.getAllSubscribers();
            res.status(HTTPStatusCode.OK).json({
                success: true,
                data: subscribers
            });
        } catch (error) {
            AppLogger.error('Error fetching subscribers:', { error });
            res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public getCampaigns = async (req: Request, res: Response): Promise<void> => {
        try {
            const campaigns = await this.newsletterService.getCampaigns();
            res.status(HTTPStatusCode.OK).json({
                success: true,
                data: campaigns
            });
        } catch (error) {
            AppLogger.error('Error fetching campaigns:', { error });
            res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
