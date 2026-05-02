// src/modules/Property/property.routes.ts
import { Router } from 'express';
import { PropertyController } from './property.controller';
import { validateRequest } from '@/middleware/validation';
import { PropertyValidation } from './property.validation';
import { authMiddleware, optionalAuthMiddleware } from '@/middleware/authMiddleware';

export class PropertyRoutes {
    private router: Router;
    private propertyController: PropertyController;

    constructor(propertyController: PropertyController) {
        this.router = Router();
        this.propertyController = propertyController;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // List properties (Public with optional auth)
        this.router.get(
            '/',
            optionalAuthMiddleware,
            this.propertyController.getAll
        );

        // Get my properties (Private - Agent only)
        this.router.get(
            '/my',
            authMiddleware,
            this.propertyController.getMyProperties
        );

        // Get saved properties
        this.router.get(
            '/saved',
            authMiddleware,
            this.propertyController.getSaved
        );

        // Get single property (Public with optional auth)
        this.router.get(
            '/:id',
            optionalAuthMiddleware,
            this.propertyController.getById
        );

        // Toggle save property
        this.router.post(
            '/:id/save',
            authMiddleware,
            this.propertyController.toggleSave
        );

        // Create property (Private - Agent only)
        this.router.post(
            '/',
            authMiddleware,
            validateRequest({
                body: PropertyValidation.create,
            }),
            this.propertyController.create
        );

        // Increment views (Public with optional agent check)
        this.router.patch(
            '/:id/view',
            optionalAuthMiddleware,
            this.propertyController.incrementViews
        );

        // Increment leads (Public)
        this.router.patch(
            '/:id/lead',
            this.propertyController.incrementLeads
        );

        // Update property (Private - Agent only)
        this.router.patch(
            '/:id',
            authMiddleware,
            this.propertyController.update
        );

        // Delete property (Private - Agent only)
        this.router.delete(
            '/:id',
            authMiddleware,
            this.propertyController.delete
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}
