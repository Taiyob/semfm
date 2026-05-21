// src/modules/Dashboard/DashboardModule.ts
import { BaseModule } from '@/core/BaseModule';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { setupDashboardRoutes } from './dashboard.routes';
import { AppLogger } from '@/core/logging/logger';

export class DashboardModule extends BaseModule {
    public readonly name = 'DashboardModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/dashboard';

    private dashboardService!: DashboardService;
    private dashboardController!: DashboardController;

    protected async setupUseCases(): Promise<void> {
        const prisma = this.context.getService('prisma');
        this.dashboardService = new DashboardService(prisma);
        AppLogger.info('DashboardService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.dashboardController = new DashboardController(this.dashboardService);
        AppLogger.info('DashboardController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        const router = setupDashboardRoutes(this.dashboardController);
        this.router.use('/', router);
        AppLogger.info('DashboardRoutes initialized successfully');
    }
}
