// src/modules/Dashboard/dashboard.controller.ts
import { Request, Response } from 'express';
import { DashboardService } from './dashboard.service';
import { AppLogger } from '@/core/logging/logger';

export class DashboardController {
    constructor(private dashboardService: DashboardService) {}

    async getDashboardSummary(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const userId = user.id;
            const role = user.role?.name || 'user';

            AppLogger.info(`Fetching dashboard stats for user ${userId} (${role})`);
            
            const data = await this.dashboardService.getDashboardStats(userId, role);
            
            return res.json({
                success: true,
                data
            });
        } catch (error) {
            AppLogger.error('Error in DashboardController:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch dashboard data',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
