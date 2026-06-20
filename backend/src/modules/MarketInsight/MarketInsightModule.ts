import { BaseModule } from '@/core/BaseModule';
import { MarketInsightService } from './marketInsight.service';
import { MarketInsightController } from './marketInsight.controller';
import { MarketInsightRoutes } from './marketInsight.routes';
import { AppLogger } from '@/core/logging/logger';

export class MarketInsightModule extends BaseModule {
    public readonly name = 'MarketInsightModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/market-insights';

    private marketInsightService!: MarketInsightService;
    private marketInsightController!: MarketInsightController;
    private marketInsightRoutes!: MarketInsightRoutes;

    protected async setupUseCases(): Promise<void> {
        this.marketInsightService = new MarketInsightService(this.context.getService('prisma'));
        AppLogger.info('MarketInsightService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.marketInsightController = new MarketInsightController(this.marketInsightService);
        AppLogger.info('MarketInsightController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        this.marketInsightRoutes = new MarketInsightRoutes(this.marketInsightController);
        AppLogger.info('MarketInsightRoutes initialized successfully');

        this.router.use('/', this.marketInsightRoutes.getRouter());
    }
}
