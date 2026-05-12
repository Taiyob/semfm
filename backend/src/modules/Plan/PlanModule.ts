import { BaseModule } from '@/core/BaseModule';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { PlanRoutes } from './plan.routes';
import { AppLogger } from '@/core/logging/logger';

export class PlanModule extends BaseModule {
    public readonly name = 'PlanModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/plans';

    private planService!: PlanService;
    private planController!: PlanController;
    private planRoutes!: PlanRoutes;

    protected async setupUseCases(): Promise<void> {
        this.planService = new PlanService(this.context.getService('prisma'));
        AppLogger.info('PlanService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.planController = new PlanController(this.planService);
        AppLogger.info('PlanController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        this.planRoutes = new PlanRoutes(this.planController);
        AppLogger.info('PlanRoutes initialized successfully');

        this.router.use('/', this.planRoutes.getRouter());
    }
}
