import { BaseModule } from '@/core/BaseModule';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionRoutes } from './subscription.routes';
import { AppLogger } from '@/core/logging/logger';

export class SubscriptionModule extends BaseModule {
    public readonly name = 'SubscriptionModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/subscriptions';

    private subscriptionService!: SubscriptionService;
    private subscriptionController!: SubscriptionController;
    private subscriptionRoutes!: SubscriptionRoutes;

    protected async setupUseCases(): Promise<void> {
        this.subscriptionService = new SubscriptionService(this.context.getService('prisma'));
        AppLogger.info('SubscriptionService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.subscriptionController = new SubscriptionController(this.subscriptionService);
        AppLogger.info('SubscriptionController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        this.subscriptionRoutes = new SubscriptionRoutes(this.subscriptionController);
        AppLogger.info('SubscriptionRoutes initialized successfully');

        this.router.use('/', this.subscriptionRoutes.getRouter());
    }
}
