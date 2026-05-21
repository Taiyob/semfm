// src/modules/Dashboard/dashboard.routes.ts
import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authMiddleware } from '@/middleware/authMiddleware';

export function setupDashboardRoutes(controller: DashboardController): Router {
    const router = Router();

    // Protect all dashboard routes
    router.use(authMiddleware);

    router.get('/', (req, res) => controller.getDashboardSummary(req, res));

    return router;
}
