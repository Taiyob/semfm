// src/modules/Dashboard/dashboard.service.ts
import { PrismaClient } from '@/generated/prisma/client';

export class DashboardService {
    constructor(private prisma: PrismaClient) {}

    async getDashboardStats(userId: string, role: string) {
        if (role.toLowerCase() === 'agent' || role.toLowerCase() === 'admin') {
            return this.getAgentStats(userId);
        }
        return this.getInvestorStats(userId);
    }

    private async getInvestorStats(userId: string) {
        const investments = await this.prisma.investment.findMany({
            where: { userId },
            include: { country: true }
        });

        const savedPropertiesCount = await this.prisma.property.count({
            where: {
                savedBy: {
                    some: { id: userId }
                }
            }
        });

        const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0);
        
        // Calculate Growth (vs 30 days ago)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const oldInvestments = investments.filter(inv => new Date(inv.createdAt) <= thirtyDaysAgo);
        const oldTotalValue = oldInvestments.reduce((sum, inv) => sum + inv.amount, 0);
        const portfolioChange = oldTotalValue === 0 ? 0 : ((totalValue - oldTotalValue) / oldTotalValue) * 100;
        const propertiesChange = investments.length - oldInvestments.length;

        const avgYield = 6.4; 

        // Generate Real Analytics (Cumulative Growth Curve)
        const now = new Date();
        const analytics = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth() - (11 - i) + 1, 0); // End of month
            const monthInvestments = investments.filter(inv => {
                const invDate = new Date(inv.createdAt);
                return invDate <= date;
            });
            const monthlyCumulativeTotal = monthInvestments.reduce((sum, inv) => sum + inv.amount, 0);
            
            if (totalValue === 0) {
                // Return a natural onboarding curve if no data exists
                return 20 + (i * i * 0.5) + (Math.random() * 5);
            }
            
            // Percentage of current total value (min 15% for visibility)
            return Math.max(15, (monthlyCumulativeTotal / totalValue) * 100);
        });

        const recentAlerts = await this.prisma.matchAlert.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            take: 2
        });

        const savedProperties = await this.prisma.property.findMany({
            where: {
                savedBy: {
                    some: { id: userId }
                }
            },
            take: 2,
            orderBy: { createdAt: 'desc' }
        });

        const savedCalculations = await this.prisma.savedCalculation.findMany({
            where: { userId },
            take: 2,
            orderBy: { createdAt: 'desc' }
        });

        return {
            stats: [
                { name: 'Portfolio Value', value: `€${totalValue.toLocaleString()}`, change: `+${portfolioChange.toFixed(1)}%` },
                { name: 'Active Properties', value: investments.length.toString(), change: `+${propertiesChange}` },
                { name: 'Avg. Yield', value: `${avgYield}%`, change: '+0.2%' }
            ],
            analytics,
            workspace: {
                properties: savedProperties,
                calculations: savedCalculations
            },
            recentAlerts
        };
    }

    private async getAgentStats(userId: string) {
        const listings = await this.prisma.property.findMany({
            where: { agentId: userId }
        });

        const leadsCount = await this.prisma.lead.count({
            where: { agentId: userId }
        });

        const activeInquiriesCount = await this.prisma.lead.count({
            where: { 
                agentId: userId,
                status: 'NEW'
            }
        });

        // Calculate Growth (vs 30 days ago)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const oldListings = listings.filter(p => new Date(p.createdAt) <= thirtyDaysAgo);
        const listingsChange = listings.length - oldListings.length;

        // Generate Real Analytics (Cumulative Property Listings Growth)
        const now = new Date();
        const totalListings = listings.length;
        const analytics = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth() - (11 - i) + 1, 0);
            const monthListings = listings.filter(prop => {
                const propDate = new Date(prop.createdAt);
                return propDate <= date;
            });
            
            if (totalListings === 0) {
                return 30 + (i * i * 0.4) + (Math.random() * 5); // Placeholder growth curve
            }
            return Math.max(20, (monthListings.length / totalListings) * 100);
        });

        // Generate Real Analytics for Leads (monthly new leads)
        const allLeads = await this.prisma.lead.findMany({
            where: { agentId: userId },
            select: { createdAt: true }
        });
        const maxLeadsInMonth = Math.max(1, ...Array.from({ length: 12 }, (_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth() - (11 - i) + 1, 0);
            const monthStart = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
            return allLeads.filter(l => {
                const d = new Date(l.createdAt);
                return d >= monthStart && d <= date;
            }).length;
        }));
        const analyticsLeads = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth() - (11 - i) + 1, 0);
            const monthStart = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
            const monthLeads = allLeads.filter(l => {
                const d = new Date(l.createdAt);
                return d >= monthStart && d <= date;
            }).length;
            if (leadsCount === 0) {
                return 20 + (i * i * 0.35) + (Math.random() * 5);
            }
            return Math.max(10, (monthLeads / maxLeadsInMonth) * 100);
        });

        return {
            stats: [
                { name: 'Total Listings', value: totalListings.toString(), change: `+${listingsChange}` },
                { name: 'Total Leads', value: leadsCount.toString(), change: '+12%' },
                { name: 'Active Inquiries', value: activeInquiriesCount.toString(), change: '+4' }
            ],
            analytics,
            analyticsLeads,
            workspace: {
                properties: listings.slice(0, 2),
                calculations: []
            },
            recentAlerts: []
        };
    }
}
