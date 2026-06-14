import { Request, Response } from 'express';
import { ClubService } from './club.service';
import { HTTPStatusCode } from '../../types/HTTPStatusCode';
import { catchAsync } from '@/utils/catchAsync';

const clubService = new ClubService();

export class ClubController {
  public submitApplication = catchAsync(async (req: Request, res: Response) => {
    const { name, email, country, reason } = req.body;

    if (!name || !email || !country || !reason) {
      return res.status(HTTPStatusCode.BAD_REQUEST).json({
        success: false,
        message: 'Name, email, country, and reason are required',
      });
    }

    const application = await clubService.createApplication({ name, email, country, reason });

    res.status(HTTPStatusCode.CREATED).json({
      success: true,
      data: application,
      message: 'Application submitted successfully',
    });
  });
}
