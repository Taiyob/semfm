import { Request, Response } from 'express';
import { RegionService } from './region.service';
import { catchAsync } from '@/utils/catchAsync';
import sendResponse from '@/utils/sendResponse';

const regionService = new RegionService();

const getAllRegions = catchAsync(async (req: Request, res: Response) => {
    const result = await regionService.getAllRegions();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Regions retrieved successfully',
        data: result,
    });
});

const createRegion = catchAsync(async (req: Request, res: Response) => {
    const result = await regionService.createRegion(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Region created successfully',
        data: result,
    });
});

const updateRegion = catchAsync(async (req: Request, res: Response) => {
    const result = await regionService.updateRegion(req.params.id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Region updated successfully',
        data: result,
    });
});

const deleteRegion = catchAsync(async (req: Request, res: Response) => {
    const result = await regionService.deleteRegion(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Region deleted successfully',
        data: result,
    });
});

export const RegionController = {
    getAllRegions,
    createRegion,
    updateRegion,
    deleteRegion,
};
