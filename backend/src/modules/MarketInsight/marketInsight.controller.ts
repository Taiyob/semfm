import { Request, Response } from 'express';
import { BaseController } from '@/core/BaseController';
import { MarketInsightService } from './marketInsight.service';
import { catchAsync } from '@/utils/catchAsync';

export class MarketInsightController extends BaseController {
    constructor(private marketInsightService: MarketInsightService) {
        super();
    }

    public getAllInsights = catchAsync(async (req: Request, res: Response) => {
        const filter: any = {};
        if (req.query.search) {
            filter.regionName = {
                contains: req.query.search as string,
                mode: 'insensitive'
            };
        }

        const paginationParams = this.extractPaginationParams(req);
        
        // Sorting logic based on query params
        let sort: any = { createdAt: 'desc' };
        if (req.query.sortBy && req.query.sortOrder) {
            sort = { [req.query.sortBy as string]: req.query.sortOrder as string };
        }

        const result = await this.marketInsightService.findAllWithCountry(
            filter,
            { page: paginationParams.page, limit: paginationParams.limit },
            sort
        );

        return this.sendPaginatedResponse(
            req,
            res,
            {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                hasNext: result.hasNext,
                hasPrevious: result.hasPrevious
            },
            'Market insights retrieved successfully',
            result.data
        );
    });

    public getInsightById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const insight = await this.marketInsightService.findById(id);
        if (!insight) {
            return res.status(404).json({ success: false, message: 'Market insight not found' });
        }
        return this.sendResponse(req, res, 'Market insight retrieved successfully', undefined, insight);
    });

    public createInsight = catchAsync(async (req: Request, res: Response) => {
        const insight = await this.marketInsightService.createInsight(req.body);
        return this.sendCreatedResponse(req, res, insight);
    });

    public updateInsight = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const insight = await this.marketInsightService.updateInsight(id, req.body);
        return this.sendResponse(req, res, 'Market insight updated successfully', undefined, insight);
    });

    public deleteInsight = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        await this.marketInsightService.deleteInsight(id);
        return this.sendResponse(req, res, 'Market insight deleted successfully');
    });
}
