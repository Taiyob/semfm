// src/modules/User/user.controller.ts
import { Request, Response } from 'express';
import { BaseController } from '@/core/BaseController';
import { UserService } from './user.service';
import { catchAsync } from '@/utils/catchAsync';

export class UserController extends BaseController {
    constructor(private userService: UserService) {
        super();
    }

    /**
     * @route PATCH /api/users/profile
     * @desc Update current user profile
     */
    public updateProfile = catchAsync(async (req: Request, res: Response) => {
        const userId = req.user.id;
        const result = await this.userService.updateProfile(userId, req.body);
        
        // Omit password from response
        const { password, ...userWithoutPassword } = result as any;

        return this.sendResponse(req, res, 'Profile updated successfully', undefined, { user: userWithoutPassword });
    });
}
