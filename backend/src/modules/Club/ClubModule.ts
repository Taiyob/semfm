import { BaseModule } from '@/core/BaseModule';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import clubRoutes from './club.routes';
import { AppLogger } from '@/core/logging/logger';

export class ClubModule extends BaseModule {
    public readonly name = 'ClubModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/v1/club';

    private clubService!: ClubService;
    private clubController!: ClubController;

    protected async setupUseCases(): Promise<void> {
        this.clubService = new ClubService();
        AppLogger.info('ClubService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.clubController = new ClubController();
        AppLogger.info('ClubController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        this.router.use('/', clubRoutes);
        AppLogger.info('ClubRoutes initialized successfully');
    }
}
