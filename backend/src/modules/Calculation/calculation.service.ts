import { PrismaClient, SavedCalculation } from '@/generated/prisma/client';
import { BaseService } from "@/core/BaseService";

export class CalculationService extends BaseService<SavedCalculation> {
    constructor(prisma: PrismaClient) {
        super(prisma, 'SavedCalculation', {
            enableSoftDelete: false,
            enableAuditFields: false,
        });
    }

    protected getModel() {
        return this.prisma.savedCalculation;
    }

    /**
     * Get user's saved calculations
     */
    async getUserCalculations(userId: string) {
        return this.prisma.savedCalculation.findMany({
            where: { userId },
            include: { property: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Save a new calculation
     */
    async saveCalculation(userId: string, data: any) {
        return this.prisma.savedCalculation.create({
            data: {
                userId,
                propertyId: data.propertyId || null,
                name: data.name,
                inputData: data.inputData,
                resultsData: data.resultsData
            }
        });
    }

    /**
     * Delete a calculation
     */
    async deleteCalculation(userId: string, id: string) {
        const calculation = await this.prisma.savedCalculation.findUnique({
            where: { id }
        });

        if (!calculation || calculation.userId !== userId) {
            throw new Error('Calculation not found or unauthorized');
        }

        return this.prisma.savedCalculation.delete({
            where: { id }
        });
    }
}
