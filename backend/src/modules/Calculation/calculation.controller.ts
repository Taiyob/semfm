import { Request, Response } from 'express';
import { CalculationService } from './calculation.service';
import { AppError } from '@/core/errors/AppError';

export class CalculationController {
    constructor(private calculationService: CalculationService) {}

    async getMyCalculations(req: Request, res: Response) {
        const userId = (req as any).user.id;
        const calculations = await this.calculationService.getUserCalculations(userId);
        
        res.json({
            status: 'success',
            data: { calculations }
        });
    }

    async saveCalculation(req: Request, res: Response) {
        const userId = (req as any).user.id;
        const calculation = await this.calculationService.saveCalculation(userId, req.body);

        res.status(201).json({
            status: 'success',
            data: { calculation }
        });
    }

    async deleteCalculation(req: Request, res: Response) {
        const userId = (req as any).user.id;
        const { id } = req.params;
        
        await this.calculationService.deleteCalculation(userId, id);

        res.json({
            status: 'success',
            message: 'Calculation deleted successfully'
        });
    }
}
