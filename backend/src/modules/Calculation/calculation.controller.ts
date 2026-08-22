import { Request, Response } from 'express';
import { CalculationService } from './calculation.service';
import { ShortTermService } from './shortTerm.service';
import { AppError } from '@/core/errors/AppError';

export class CalculationController {
    private shortTermService: ShortTermService;

    constructor(private calculationService: CalculationService) {
        this.shortTermService = new ShortTermService();
    }

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
        
        await this.calculationService.deleteCalculation(userId, id as string);

        res.json({
            status: 'success',
            message: 'Calculation deleted successfully'
        });
    }

    async calculateShortTermEstimate(req: Request, res: Response) {
        try {
            const { city, zone, condition, guestCapacity, bedrooms, bathrooms, listingType } = req.body;
            
            const occupancy = await this.shortTermService.calculateOccupancy(city, zone, condition, guestCapacity);
            const nightlyRate = await this.shortTermService.calculateNightlyRate(
                city, bedrooms, bathrooms, listingType, guestCapacity, zone, condition
            );

            res.json({
                status: 'success',
                data: {
                    occupancy,
                    nightlyRate
                }
            });
        } catch (error: any) {
            res.status(500).json({
                status: 'error',
                message: error.message || 'Failed to calculate short-term estimate'
            });
        }
    }
}
