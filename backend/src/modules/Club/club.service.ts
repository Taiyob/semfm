import { PrismaClient, ClubApplication } from '@/generated/prisma/client';
import { BaseService } from '../../core/BaseService';
import { AppLogger } from '../../core/logging/logger';
import { prisma } from '../../lib/prisma'; // keeping this if needed, but BaseService uses this.prisma

export class ClubService extends BaseService<ClubApplication> {
    constructor() {
        super(prisma, 'ClubApplication', {
            enableSoftDelete: false,
            enableAuditFields: false,
        });
    }

    protected getModel() {
        return this.prisma.clubApplication;
    }

    /**
     * Create a new club application (Public)
     */
    async createApplication(data: { name: string; email: string; country: string; reason: string }) {
        AppLogger.info('Creating new Club Application', { email: data.email });
        
        const application = await this.create({
            name: data.name,
            email: data.email,
            country: data.country,
            reason: data.reason,
            status: 'PENDING'
        });

        return application;
    }

    /**
     * Get all club applications with pagination and search
     */
    async getAllApplications(query: any) {
        const { page = 1, limit = 10, search, sortBy, sortOrder, status } = query;
        const skip = (Number(page) - 1) * Number(limit);

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { name: { contains: search as string, mode: 'insensitive' } },
                { email: { contains: search as string, mode: 'insensitive' } },
                { country: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        let orderBy: any = { createdAt: 'desc' };
        if (sortBy && sortOrder) {
            orderBy = { [sortBy as string]: sortOrder };
        }

        const [data, total] = await Promise.all([
            this.prisma.clubApplication.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy,
            }),
            this.prisma.clubApplication.count({ where }),
        ]);

        const totalPages = Math.ceil(total / Number(limit));
        const currentPage = Number(page);

        return {
            data,
            total,
            page: currentPage,
            limit: Number(limit),
            totalPages,
            hasNext: currentPage < totalPages,
            hasPrevious: currentPage > 1,
        };
    }

    /**
     * Update application status
     */
    async updateStatus(id: string, status: string) {
        return this.updateById(id, { status });
    }

    /**
     * Delete application
     */
    async deleteApplication(id: string) {
        return this.deleteById(id);
    }
}
