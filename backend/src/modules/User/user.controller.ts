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

    /**
     * @route GET /api/users
     * @desc Get all users
     */
    public getAllUsers = catchAsync(async (req: Request, res: Response) => {
        const { page, limit } = this.extractPaginationParams(req);
        const { search, sort, sortOrder } = req.query;

        const where: any = {};
        if (search) {
            where.OR = [
                { firstName: { contains: search as string, mode: 'insensitive' } },
                { lastName: { contains: search as string, mode: 'insensitive' } },
                { email: { contains: search as string, mode: 'insensitive' } },
                { displayName: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        const orderBy: any = {};
        if (sort) {
            orderBy[sort as string] = sortOrder === 'asc' ? 'asc' : 'desc';
        } else {
            orderBy.createdAt = 'desc';
        }

        const result = await this.userService.findMany(where, { page, limit }, orderBy, { role: true });

        // Remove passwords
        const usersWithoutPassword = result.data.map((user: any) => {
            const { password, roleId, ...userRest } = user;
            return {
                ...userRest,
                role: user.role?.name || 'subscriber' // map role object to string for frontend
            };
        });

        const pagination = {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        };

        return this.sendPaginatedResponse(req, res, pagination, 'Users retrieved successfully', usersWithoutPassword);
    });

    /**
     * @route DELETE /api/users/:id
     * @desc Delete a user
     */
    public deleteUser = catchAsync(async (req: Request, res: Response) => {
        const { id } = req.params;
        await this.userService.deleteById(id);
        return this.sendResponse(req, res, 'User deleted successfully');
    });
}
