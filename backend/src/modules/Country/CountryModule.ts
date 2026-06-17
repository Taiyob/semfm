import { BaseModule } from '@/core/BaseModule';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { CountryRoutes } from './country.routes';
import { AppLogger } from '@/core/logging/logger';

export class CountryModule extends BaseModule {
    public readonly name = 'CountryModule';
    public readonly version = '1.0.0';
    public readonly dependencies = [];
    public readonly basePath = '/api/countries';

    private countryService!: CountryService;
    private countryController!: CountryController;
    private countryRoutes!: CountryRoutes;

    protected async setupUseCases(): Promise<void> {
        this.countryService = new CountryService(this.context.getService('prisma'));
        AppLogger.info('CountryService initialized successfully');
    }

    protected async setupControllers(): Promise<void> {
        this.countryController = new CountryController(this.countryService);
        AppLogger.info('CountryController initialized successfully');
    }

    protected async setupRoutes(): Promise<void> {
        this.countryRoutes = new CountryRoutes(this.countryController);
        AppLogger.info('CountryRoutes initialized successfully');

        this.router.use('/', this.countryRoutes.getRouter());
    }
}
