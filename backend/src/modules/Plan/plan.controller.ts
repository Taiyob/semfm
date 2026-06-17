import { Request, Response, NextFunction } from 'express';
import { BaseController } from '@/core/BaseController';
import { PlanService } from './plan.service';
import { catchAsync } from '@/utils/catchAsync';

export class PlanController extends BaseController {
    constructor(private planService: PlanService) {
        super();
    }

    public getAllPlans = catchAsync(async (req: Request, res: Response) => {
        const filter: any = {};
        if (req.query.includeInactive !== 'true') {
            filter.isActive = true;
        }
        const plans = await this.planService.findMany(filter);
        return this.sendResponse(req, res, 'Plans retrieved successfully', undefined, plans.data);
    });

    public getPlanById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const plan = await this.planService.findById(id);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }
        return this.sendResponse(req, res, 'Plan retrieved successfully', undefined, plan);
    });

    public createPlan = catchAsync(async (req: Request, res: Response) => {
        const plan = await this.planService.createPlan(req.body);
        return this.sendCreatedResponse(req, res, plan);
    });

    public updatePlan = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const plan = await this.planService.updatePlan(id, req.body);
        return this.sendResponse(req, res, 'Plan updated successfully', undefined, plan);
    });

    public deletePlan = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        await this.planService.deletePlan(id);
        return this.sendResponse(req, res, 'Plan deleted successfully');
    });
}
