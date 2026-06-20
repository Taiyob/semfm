import { Router } from 'express';
import { MarketInsightController } from './marketInsight.controller';

export class MarketInsightRoutes {
    private router: Router;

    constructor(private marketInsightController: MarketInsightController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.marketInsightController.getAllInsights);
        this.router.get('/:id', this.marketInsightController.getInsightById);
        this.router.post('/', this.marketInsightController.createInsight);
        this.router.patch('/:id', this.marketInsightController.updateInsight);
        this.router.delete('/:id', this.marketInsightController.deleteInsight);
    }

    public getRouter(): Router {
        return this.router;
    }
}
