import { BaseModule } from '@/core/BaseModule';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { NewsletterRoutes } from './newsletter.routes';
import { AppLogger } from '@/core/logging/logger';

export class NewsletterModule extends BaseModule {
    public readonly name = 'NewsletterModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/v1/newsletter';

    private newsletterService!: NewsletterService;
    private newsletterController!: NewsletterController;
    private newsletterRoutes!: NewsletterRoutes;

    protected async setupUseCases(): Promise<void> {
        this.newsletterService = new NewsletterService(this.context.getService('prisma'));
        AppLogger.info('NewsletterService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.newsletterController = new NewsletterController(this.newsletterService);
        AppLogger.info('NewsletterController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        this.newsletterRoutes = new NewsletterRoutes(this.newsletterController);
        AppLogger.info('NewsletterRoutes initialized successfully');

        this.router.use('/', this.newsletterRoutes.getRouter());
    }
}
