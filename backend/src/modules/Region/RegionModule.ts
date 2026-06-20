import { BaseModule } from '@/core/BaseModule';
import { RegionRoutes } from './region.routes';
import { AppLogger } from '@/core/logging/logger';

export class RegionModule extends BaseModule {
    public readonly name = 'RegionModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/regions';

    protected async setupUseCases(): Promise<void> {
        AppLogger.info('RegionService initialized');
    }

    protected async setupControllers(): Promise<void> {
        AppLogger.info('RegionController initialized');
    }

    protected async setupRoutes(): Promise<void> {
        this.router.use('/', RegionRoutes);
        AppLogger.info('RegionRoutes initialized');
    }
}
