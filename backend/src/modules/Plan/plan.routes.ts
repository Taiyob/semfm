import { Router } from 'express';
import { PlanController } from './plan.controller';

export class PlanRoutes {
    private router: Router;

    constructor(private planController: PlanController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.planController.getAllPlans);
        this.router.get('/:id', this.planController.getPlanById);
        this.router.post('/', this.planController.createPlan);
        this.router.patch('/:id', this.planController.updatePlan);
        this.router.delete('/:id', this.planController.deletePlan);
    }

    public getRouter(): Router {
        return this.router;
    }
}
