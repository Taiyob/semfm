import { Router } from 'express';
import { NewsletterController } from './newsletter.controller';

export class NewsletterRoutes {
    private router: Router;

    constructor(private controller: NewsletterController) {
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post('/subscribe', this.controller.subscribe);
    }

    public getRouter(): Router {
        return this.router;
    }
}
