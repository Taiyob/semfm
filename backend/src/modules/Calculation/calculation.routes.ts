import { Router } from 'express';
import { CalculationController } from './calculation.controller';
import { authMiddleware } from '@/middleware/authMiddleware';

export class CalculationRoutes {
    private router: Router;
    private controller: CalculationController;

    constructor(controller: CalculationController) {
        this.router = Router();
        this.controller = controller;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(authMiddleware);

        this.router.get('/my', (req, res) => this.controller.getMyCalculations(req, res));
        this.router.post('/', (req, res) => this.controller.saveCalculation(req, res));
        this.router.delete('/:id', (req, res) => this.controller.deleteCalculation(req, res));
    }

    public getRouter(): Router {
        return this.router;
    }
}
