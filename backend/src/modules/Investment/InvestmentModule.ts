import { BaseModule } from '@/core/BaseModule';
import { InvestmentService } from './investment.service';
import { InvestmentController } from './investment.controller';
import { InvestmentRoutes } from './investment.routes';
import { AppLogger } from '@/core/logging/logger';

export class InvestmentModule extends BaseModule {
    public readonly name = 'InvestmentModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/investments';

    private investmentService!: InvestmentService;
    private investmentController!: InvestmentController;
    private investmentRoutes!: InvestmentRoutes;

    protected async setupUseCases(): Promise<void> {
        this.investmentService = new InvestmentService(this.context.getService('prisma'));
        AppLogger.info('InvestmentService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.investmentController = new InvestmentController(this.investmentService);
        AppLogger.info('InvestmentController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        this.investmentRoutes = new InvestmentRoutes(this.investmentController);
        AppLogger.info('InvestmentRoutes initialized successfully');

        this.router.use('/', this.investmentRoutes.getRouter());
    }
}
