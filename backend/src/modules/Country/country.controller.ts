import { Request, Response, NextFunction } from 'express';
import { BaseController } from '@/core/BaseController';
import { CountryService } from './country.service';
import { catchAsync } from '@/utils/catchAsync';

export class CountryController extends BaseController {
    constructor(private countryService: CountryService) {
        super();
    }

    public getAllCountries = catchAsync(async (req: Request, res: Response) => {
        const filter: any = {};
        if (req.query.includeInactive !== 'true') {
            filter.isActive = true;
        }

        const paginationParams = this.extractPaginationParams(req);

        const result = await this.countryService.findMany(
            filter,
            { page: paginationParams.page, limit: paginationParams.limit },
            { name: 'asc' }
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
            'Countries retrieved successfully',
            result.data
        );
    });

    public getCountryById = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const country = await this.countryService.findById(id);
        if (!country) {
            return res.status(404).json({ success: false, message: 'Country not found' });
        }
        return this.sendResponse(req, res, 'Country retrieved successfully', undefined, country);
    });

    public createCountry = catchAsync(async (req: Request, res: Response) => {
        const country = await this.countryService.createCountry(req.body);
        return this.sendCreatedResponse(req, res, country);
    });

    public updateCountry = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const country = await this.countryService.updateCountry(id, req.body);
        return this.sendResponse(req, res, 'Country updated successfully', undefined, country);
    });

    public deleteCountry = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        await this.countryService.deleteCountry(id);
        return this.sendResponse(req, res, 'Country deleted successfully');
    });
}
