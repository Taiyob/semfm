import { Router } from 'express';
import { NewsletterController } from './newsletter.controller';
import { authMiddleware } from '@/middleware/authMiddleware';
import { requireRole } from '@/middleware/roleMiddleware';

export class NewsletterRoutes {
    private router: Router;

    constructor(private controller: NewsletterController) {
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post('/subscribe', this.controller.subscribe);

        // Protected Admin Routes
        this.router.use(authMiddleware);
        this.router.use(requireRole(['admin']));
        this.router.get('/', this.controller.getAllSubscribers);
    }

    public getRouter(): Router {
        return this.router;
    }
}
