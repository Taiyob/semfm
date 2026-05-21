// src/modules/Alert/alert.service.ts
import { PrismaClient, MatchAlert, Property } from '@/generated/prisma/client';
import { BaseService } from '@/core/BaseService';
import { AppLogger } from '@/core/logging/logger';

export class AlertService extends BaseService<MatchAlert> {
    constructor(prisma: PrismaClient) {
        super(prisma, 'MatchAlert', {
            enableSoftDelete: false,
            enableAuditFields: false,
        });
    }

    protected getModel() {
        return this.prisma.matchAlert;
    }

    /**
     * Get user's active alerts
     */
    async getUserAlerts(userId: string) {
        return this.prisma.matchAlert.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Create a new alert
     */
    async createAlert(userId: string, data: any) {
        return this.prisma.matchAlert.create({
            data: {
                userId,
                name: data.name,
                criteria: data.criteria,
                isActive: true
            }
        });
    }

    /**
     * Toggle alert status
     */
    async toggleAlert(userId: string, id: string) {
        const alert = await this.prisma.matchAlert.findUnique({ where: { id } });
        if (!alert || alert.userId !== userId) throw new Error('Alert not found');

        return this.prisma.matchAlert.update({
            where: { id },
            data: { isActive: !alert.isActive }
        });
    }

    /**
     * Process a new property against all active alerts
     */
    async processPropertyAgainstAlerts(property: Property) {
        AppLogger.info(`🔔 Processing alerts for new property: ${property.title} (${property.id})`);

        // 1. Fetch all active alerts
        const activeAlerts = await this.prisma.matchAlert.findMany({
            where: { isActive: true },
            include: { user: true }
        });

        for (const alert of activeAlerts) {
            const criteria = alert.criteria as any;
            if (!criteria) continue;

            let isMatch = true;

            // 2. Check Criteria
            
            // Location Check
            if (criteria.region && property.region !== criteria.region) isMatch = false;
            
            // Price Check
            if (criteria.maxPrice && property.price > criteria.maxPrice) isMatch = false;
            if (criteria.minPrice && property.price < criteria.minPrice) isMatch = false;

            // Yield Check
            if (criteria.minYield && property.yield < criteria.minYield) isMatch = false;

            // Bedrooms Check
            if (criteria.minBedrooms && property.bedrooms < criteria.minBedrooms) isMatch = false;

            // Type Check
            if (criteria.propertyType && property.type !== criteria.propertyType) isMatch = false;

            // 3. If Match Found
            if (isMatch) {
                AppLogger.info(`🎯 Match found for alert: ${alert.name} (User: ${alert.user.email})`);
                
                // Update alert stats
                await this.prisma.matchAlert.update({
                    where: { id: alert.id },
                    data: {
                        lastTriggeredAt: new Date(),
                        triggerCount: { increment: 1 }
                    }
                });

                // 4. Send Notification (Placeholder)
                this.sendEmailNotification(alert.user.email, alert.name || 'Property Alert', property);
            }
        }
    }

    /**
     * Placeholder for email notification
     */
    private sendEmailNotification(email: string, alertName: string, property: Property) {
        // TODO: Integrate with real email service (Nodemailer/Resend)
        AppLogger.info(`✉️ [EMAIL PLACEHOLDER] Sending alert notification to ${email}`);
        AppLogger.info(`   Subject: Deal Found: ${alertName}`);
        AppLogger.info(`   Property: ${property.title} - €${property.price.toLocaleString()}`);
        AppLogger.info(`   Link: http://localhost:3000/properties/${property.id}`);
    }
}
