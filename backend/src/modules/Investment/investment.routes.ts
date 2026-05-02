import { Router } from "express";
import { InvestmentController } from "./investment.controller";
import { authMiddleware } from "@/middleware/authMiddleware";

export class InvestmentRoutes {
    private router: Router;
    private investmentController: InvestmentController;

    constructor(investmentController: InvestmentController) {
        this.router = Router();
        this.investmentController = investmentController;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.use(authMiddleware);

        this.router.get('/', this.investmentController.getPortfolio);
        this.router.post('/', this.investmentController.create);
        this.router.delete('/:id', this.investmentController.delete);
    }

    public getRouter(): Router {
        return this.router;
    }
}
