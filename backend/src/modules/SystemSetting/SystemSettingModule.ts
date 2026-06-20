import { BaseModule } from '@/core/BaseModule';
import { SystemSettingService } from './systemSetting.service';
import { SystemSettingController } from './systemSetting.controller';
import { SystemSettingRoutes } from './systemSetting.routes';
import { AppLogger } from '@/core/logging/logger';

export class SystemSettingModule extends BaseModule {
    public readonly name = 'SystemSettingModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/settings';

    protected async setupUseCases(): Promise<void> {
        AppLogger.info('SystemSettingService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        AppLogger.info('SystemSettingController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        this.router.use('/', SystemSettingRoutes);
        AppLogger.info('SystemSettingRoutes initialized successfully');
    }
}
