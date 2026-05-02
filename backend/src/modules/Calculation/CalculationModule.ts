import { BaseModule } from '@/core/BaseModule';
import { CalculationService } from './calculation.service';
import { CalculationController } from './calculation.controller';
import { CalculationRoutes } from './calculation.routes';
import { AppLogger } from '@/core/logging/logger';

export class CalculationModule extends BaseModule {
    public readonly name = 'CalculationModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/calculations';

    private calculationService!: CalculationService;
    private calculationController!: CalculationController;
    private calculationRoutes!: CalculationRoutes;

    protected async setupUseCases(): Promise<void> {
        this.calculationService = new CalculationService(this.context.getService('prisma'));
        AppLogger.info('CalculationService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.calculationController = new CalculationController(this.calculationService);
        AppLogger.info('CalculationController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        this.calculationRoutes = new CalculationRoutes(this.calculationController);
        AppLogger.info('CalculationRoutes initialized successfully');

        this.router.use('/', this.calculationRoutes.getRouter());
    }
}
