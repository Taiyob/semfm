// src/modules/Alert/AlertModule.ts
import { BaseModule } from '@/core/BaseModule';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { setupAlertRoutes } from './alert.routes';
import { AppLogger } from '@/core/logging/logger';

export class AlertModule extends BaseModule {
    public readonly name = 'AlertModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/alerts';

    private alertService!: AlertService;
    private alertController!: AlertController;

    protected async setupUseCases(): Promise<void> {
        const prisma = this.context.getService('prisma');
        this.alertService = new AlertService(prisma);
        
        AppLogger.info('AlertService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.alertController = new AlertController(this.alertService);
        AppLogger.info('AlertController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        const router = setupAlertRoutes(this.alertController);
        this.router.use('/', router);
        AppLogger.info('AlertRoutes initialized successfully');
    }
}
