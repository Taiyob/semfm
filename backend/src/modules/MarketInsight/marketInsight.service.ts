import { BaseService } from '@/core/BaseService';
import { MarketInsight } from '@/generated/prisma';

export class MarketInsightService extends BaseService<MarketInsight> {
    constructor(prisma: any) {
        super(prisma, 'MarketInsight');
    }

    protected getModel() {
        return this.prisma.marketInsight;
    }

    async findAllWithCountry(filter: any, pagination: any, sort: any) {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.getModel().findMany({
                where: filter,
                include: {
                    country: true,
                },
                skip,
                take: limit,
                orderBy: sort,
            }),
            this.getModel().count({ where: filter })
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: skip + limit < total,
            hasPrevious: page > 1
        };
    }

    async createInsight(data: any): Promise<MarketInsight> {
        return await this.create({
            ...data,
            availableProperties: data.availableProperties ? Number(data.availableProperties) : 0,
            averageYield: Number(data.averageYield),
            averageAppreciation: Number(data.averageAppreciation),
            vacancyRate: data.vacancyRate ? Number(data.vacancyRate) : null,
        });
    }

    async updateInsight(id: string, data: any): Promise<MarketInsight> {
        return await this.updateById(id, {
            ...data,
            availableProperties: data.availableProperties ? Number(data.availableProperties) : undefined,
            averageYield: data.averageYield ? Number(data.averageYield) : undefined,
            averageAppreciation: data.averageAppreciation ? Number(data.averageAppreciation) : undefined,
            vacancyRate: data.vacancyRate ? Number(data.vacancyRate) : undefined,
        });
    }

    async deleteInsight(id: string): Promise<MarketInsight> {
        return await this.deleteById(id);
    }
}
