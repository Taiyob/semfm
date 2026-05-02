import { PrismaClient, Investment } from '@/generated/prisma/client';
import { BaseService } from "@/core/BaseService";

export class InvestmentService extends BaseService<Investment> {
    constructor(prisma: PrismaClient) {
        super(prisma, 'Investment', {
            enableSoftDelete: false,
            enableAuditFields: false,
        });
    }

    protected getModel() {
        return this.prisma.investment;
    }

    /**
     * Get user's investment portfolio with REAL-TIME growth calculation
     */
    async getUserPortfolio(userId: string) {
        const investments = await this.prisma.investment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        // Fetch all market insights for calculation
        const insights = await this.prisma.marketInsight.findMany();

        // Calculate dynamic growth based on market trends
        return investments.map(investment => {
            const insight = insights.find(i => i.countryId === investment.countryId);
            
            // Logic: Calculate growth since purchase
            const purchaseDate = new Date(investment.createdAt);
            const now = new Date();
            const daysOwned = Math.max(1, Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24)));
            
            // Use average appreciation from insight or default to 3% annually
            const annualAppreciation = insight ? insight.averageAppreciation : 3.0;
            const dailyRate = annualAppreciation / 365;
            
            const currentGrowthPerc = dailyRate * daysOwned;
            const currentGrowthAmount = investment.amount * (currentGrowthPerc / 100);

            // Determine status based on growth
            let status: any = 'STABLE';
            if (currentGrowthPerc > 0.5) status = 'GROWING';
            if (currentGrowthPerc < -0.5) status = 'CORRECTION';

            return {
                ...investment,
                growth: Number(currentGrowthAmount.toFixed(2)),
                growthPerc: Number(currentGrowthPerc.toFixed(2)),
                status
            };
        });
    }

    /**
     * Add a new investment
     */
    async addInvestment(userId: string, data: any) {
        return this.prisma.investment.create({
            data: {
              ...data,
              userId,
              amount: Number(data.amount),
              growth: 0,
              growthPerc: 0,
            }
        });
    }

    /**
     * Delete an investment
     */
    async deleteInvestment(userId: string, id: string) {
        const investment = await this.prisma.investment.findUnique({
            where: { id }
        });

        if (!investment || investment.userId !== userId) {
            throw new Error('Investment not found or unauthorized');
        }

        return this.prisma.investment.delete({
            where: { id }
        });
    }
}
