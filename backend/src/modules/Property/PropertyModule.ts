// src/modules/Property/PropertyModule.ts
import { BaseModule } from '@/core/BaseModule';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { PropertyRoutes } from './property.routes';
import { AppLogger } from '@/core/logging/logger';

export class PropertyModule extends BaseModule {
    public readonly name = 'PropertyModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/properties';

    private propertyService!: PropertyService;
    private propertyController!: PropertyController;
    private propertyRoutes!: PropertyRoutes;

    protected async setupUseCases(): Promise<void> {
        this.propertyService = new PropertyService(this.context.getService('prisma'));
        AppLogger.info('PropertyService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.propertyController = new PropertyController(this.propertyService);
        AppLogger.info('PropertyController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        this.propertyRoutes = new PropertyRoutes(this.propertyController);
        AppLogger.info('PropertyRoutes initialized successfully');

        this.router.use('/', this.propertyRoutes.getRouter());
    }
}
