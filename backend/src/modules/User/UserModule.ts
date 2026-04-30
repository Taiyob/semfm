// src/modules/User/UserModule.ts
import { BaseModule } from '@/core/BaseModule';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRoutes } from './user.routes';
import { AppLogger } from '@/core/logging/logger';

export class UserModule extends BaseModule {
    public readonly name = 'UserModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/users';

    private userService!: UserService;
    private userController!: UserController;
    private userRoutes!: UserRoutes;

    protected async setupUseCases(): Promise<void> {
        this.userService = new UserService(this.context.getService('prisma'));
        AppLogger.info('UserService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.userController = new UserController(this.userService);
        AppLogger.info('UserController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        this.userRoutes = new UserRoutes(this.userController);
        AppLogger.info('UserRoutes initialized successfully');

        this.router.use('/', this.userRoutes.getRouter());
    }
}
