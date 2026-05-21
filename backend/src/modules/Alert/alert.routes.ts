// src/modules/Alert/alert.routes.ts
import { Router } from 'express';
import { AlertController } from './alert.controller';
import { authMiddleware } from '@/middleware/authMiddleware';

export function setupAlertRoutes(controller: AlertController): Router {
    const router = Router();

    // All alert routes require authentication
    router.use(authMiddleware);

    router.get('/', (req, res) => controller.getMyAlerts(req, res));
    router.post('/', (req, res) => controller.createAlert(req, res));
    router.patch('/:id', (req, res) => controller.updateAlert(req, res));
    router.patch('/:id/toggle', (req, res) => controller.toggleAlert(req, res));
    router.delete('/:id', (req, res) => controller.deleteAlert(req, res));

    return router;
}
