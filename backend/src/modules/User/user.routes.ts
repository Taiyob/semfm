// src/modules/User/user.routes.ts
import { Router } from 'express';
import { UserController } from './user.controller';
import { validateRequest } from '@/middleware/validation';
import { UserValidation } from './user.validation';
import { authMiddleware } from '@/middleware/authMiddleware';

export class UserRoutes {
    private router: Router;
    private userController: UserController;

    constructor(userController: UserController) {
        this.router = Router();
        this.userController = userController;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Update profile (requires authentication)
        this.router.patch(
            '/profile',
            authMiddleware,
            validateRequest({
                body: UserValidation.updateProfile,
            }),
            this.userController.updateProfile
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}
