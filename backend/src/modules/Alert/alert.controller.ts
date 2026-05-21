// src/modules/Alert/alert.controller.ts
import { Request, Response } from 'express';
import { AlertService } from './alert.service';
import { AppLogger } from '@/core/logging/logger';

export class AlertController {
    constructor(private alertService: AlertService) {}

    /**
     * Get user's alerts
     */
    async getMyAlerts(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const alerts = await this.alertService.getUserAlerts(userId);
            return res.json({ success: true, data: alerts });
        } catch (error) {
            AppLogger.error('Error fetching alerts:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch alerts' });
        }
    }

    /**
     * Create a new alert
     */
    async createAlert(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            AppLogger.info(`Creating alert for user ${userId}`, req.body);
            const alert = await this.alertService.createAlert(userId, req.body);
            return res.status(201).json({ success: true, data: alert });
        } catch (error) {
            AppLogger.error('Error creating alert:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to create alert',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Toggle alert status (Active/Paused)
     */
    async toggleAlert(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { id } = req.params;
            const alert = await this.alertService.toggleAlert(userId, id as string);
            return res.json({ success: true, data: alert });
        } catch (error) {
            AppLogger.error('Error toggling alert:', error);
            return res.status(500).json({ success: false, message: 'Failed to update alert' });
        }
    }

    /**
     * Delete an alert
     */
    async deleteAlert(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { id } = req.params;
            
            const alert = await this.alertService.findById(id as string);
            if (!alert || alert.userId !== userId) {
                return res.status(404).json({ success: false, message: 'Alert not found' });
            }

            await this.alertService.deleteById(id as string);
            return res.json({ success: true, message: 'Alert deleted successfully' });
        } catch (error) {
            AppLogger.error('Error deleting alert:', error);
            return res.status(500).json({ success: false, message: 'Failed to delete alert' });
        }
    }
    /**
     * Update an existing alert
     */
    async updateAlert(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { id } = req.params;
            const data = req.body;

            // Check ownership
            const alert = await this.alertService.findById(id as string);
            if (!alert || alert.userId !== userId) {
                return res.status(404).json({ success: false, message: 'Alert not found' });
            }

            const updatedAlert = await this.alertService.updateById(id as string, {
                name: data.name,
                criteria: data.criteria
            });

            return res.json({ success: true, data: updatedAlert });
        } catch (error) {
            AppLogger.error('Error updating alert:', error);
            return res.status(500).json({ success: false, message: 'Failed to update alert' });
        }
    }
}
