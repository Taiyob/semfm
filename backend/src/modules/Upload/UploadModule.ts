import { BaseModule } from '@/core/BaseModule';
import { AppLogger } from '@/core/logging/logger';
import uploadRoutes from './upload.routes';

export class UploadModule extends BaseModule {
    public readonly name = 'UploadModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/upload';

    protected async setupUseCases(): Promise<void> {}

    protected async setupControllers(): Promise<void> {}

    protected async setupRoutes(): Promise<void> {
        this.router.use('/', uploadRoutes);
        AppLogger.info('UploadRoutes initialized successfully');
    }
}
