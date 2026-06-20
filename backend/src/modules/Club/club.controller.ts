import { Request, Response } from 'express';
import { BaseController } from '../../core/BaseController';
import { ClubService } from './club.service';
import { HTTPStatusCode } from '../../types/HTTPStatusCode';
import { catchAsync } from '@/utils/catchAsync';

const clubService = new ClubService();

export class ClubController extends BaseController {
  
  /**
   * @route POST /api/v1/club/apply
   * @desc Submit a new club application (Public)
   */
  public submitApplication = catchAsync(async (req: Request, res: Response) => {
    const { name, email, country, reason } = req.body;

    if (!name || !email || !country || !reason) {
      return res.status(HTTPStatusCode.BAD_REQUEST).json({
        success: false,
        message: 'Name, email, country, and reason are required',
      });
    }

    const application = await clubService.createApplication({ name, email, country, reason });

    return this.sendCreatedResponse(req, res, application, 'Application submitted successfully');
  });

  /**
   * @route GET /api/v1/club
   * @desc Get all club applications (Admin)
   */
  public getAllApplications = catchAsync(async (req: Request, res: Response) => {
    const result = await clubService.getAllApplications(req.query);
    const { data, ...pagination } = result;
    return this.sendPaginatedResponse(req, res, pagination, 'Club applications fetched successfully', data);
  });

  /**
   * @route PATCH /api/v1/club/:id/status
   * @desc Update application status (Admin)
   */
  public updateStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(HTTPStatusCode.BAD_REQUEST).json({
        success: false,
        message: 'Status is required',
      });
    }

    const application = await clubService.updateStatus(id, status);
    return this.sendResponse(req, res, 'Application status updated successfully', HTTPStatusCode.OK, application);
  });

  /**
   * @route DELETE /api/v1/club/:id
   * @desc Delete an application (Admin)
   */
  public deleteApplication = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await clubService.deleteApplication(id);
    return this.sendNoContentResponse(res);
  });
}
