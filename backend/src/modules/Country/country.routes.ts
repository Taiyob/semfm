import { Router } from 'express';
import { CountryController } from './country.controller';

export class CountryRoutes {
    private router: Router;

    constructor(private countryController: CountryController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.countryController.getAllCountries);
        this.router.get('/:id', this.countryController.getCountryById);
        this.router.post('/', this.countryController.createCountry);
        this.router.patch('/:id', this.countryController.updateCountry);
        this.router.delete('/:id', this.countryController.deleteCountry);
    }

    public getRouter(): Router {
        return this.router;
    }
}
