import { Request, Response } from 'express';
import { SystemSettingService } from './systemSetting.service';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const systemSettingService = new SystemSettingService();

const getCalculatorSettings = catchAsync(async (req: Request, res: Response) => {
    const result = await systemSettingService.getCalculatorSettings();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Calculator settings retrieved successfully',
        data: result,
    });
});

const updateCalculatorSettings = catchAsync(async (req: Request, res: Response) => {
    const result = await systemSettingService.updateCalculatorSettings(req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Calculator settings updated successfully',
        data: result,
    });
});

export const SystemSettingController = {
    getCalculatorSettings,
    updateCalculatorSettings,
};
