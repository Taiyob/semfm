import { BaseModule } from '@/core/BaseModule';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { LeadRoutes } from './lead.routes';
import { AppLogger } from '@/core/logging/logger';

export class LeadModule extends BaseModule {
    public readonly name = 'LeadModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/leads';

    private leadService!: LeadService;
    private leadController!: LeadController;
    private leadRoutes!: LeadRoutes;

    protected async setupUseCases(): Promise<void> {
        this.leadService = new LeadService(this.context.getService('prisma'));
        AppLogger.info('LeadService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.leadController = new LeadController(this.leadService);
        AppLogger.info('LeadController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        this.leadRoutes = new LeadRoutes(this.leadController);
        AppLogger.info('LeadRoutes initialized successfully');

        this.router.use('/', this.leadRoutes.getRouter());
    }
}
