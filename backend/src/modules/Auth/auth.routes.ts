// src/modules/Auth/auth.routes.ts
import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '@/middleware/validation';
import { AuthValidation } from './auth.validation';
import { authMiddleware } from '@/middleware/authMiddleware';

export class AuthRoutes {
    private router: Router;
    private authController: AuthController;

    constructor(authController: AuthController) {
        this.router = Router();
        this.authController = authController;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Register new user
        this.router.post(
            '/register',
            validateRequest({
                body: AuthValidation.register,
            }),
            this.authController.register
        );

        // Login user
        this.router.post(
            '/login',
            validateRequest({
                body: AuthValidation.login,
            }),
            this.authController.login
        );

        // Logout user
        this.router.post(
            '/logout',
            this.authController.logout
        );

        // Get current user
        this.router.get(
            '/me',
            authMiddleware,
            this.authController.getMe
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}
