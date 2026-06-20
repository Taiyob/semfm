import { BaseModule } from '@/core/BaseModule';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import blogRoutes from './blog.routes';
import { AppLogger } from '@/core/logging/logger';

export class BlogModule extends BaseModule {
    public readonly name = 'BlogModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/v1/blog';

    private blogService!: BlogService;
    private blogController!: BlogController;

    protected async setupUseCases(): Promise<void> {
        this.blogService = new BlogService();
        AppLogger.info('BlogService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.blogController = new BlogController();
        AppLogger.info('BlogController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        this.router.use('/', blogRoutes);
        AppLogger.info('BlogRoutes initialized successfully');
    }
}
