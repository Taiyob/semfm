import { BaseService } from '@/core/BaseService';
import { Country } from '@/generated/prisma';

export class CountryService extends BaseService<Country> {
    constructor(prisma: any) {
        super(prisma, 'Country');
    }

    protected getModel() {
        return this.prisma.country;
    }
    
    async findMany(filter: any = {}, options: any = {}, sort: any = {}): Promise<any> {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.getModel().findMany({
                where: filter,
                skip,
                take: limit,
                orderBy: sort,
                include: {
                    _count: {
                        select: {
                            properties: { where: { status: 'AVAILABLE' } }
                        }
                    }
                }
            }),
            this.getModel().count({ where: filter })
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrevious: page > 1
        };
    }
    
    async findById(id: string): Promise<Country | null> {
        return await this.getModel().findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        properties: { where: { status: 'AVAILABLE' } }
                    }
                }
            }
        });
    }

    async findBySlug(slug: string): Promise<Country | null> {
        return await this.getModel().findUnique({
            where: { slug },
            include: {
                insights: true,
                _count: {
                    select: {
                        properties: { where: { status: 'AVAILABLE' } }
                    }
                }
            }
        });
    }

    async createCountry(data: { name: string; slug: string; continent?: string; imageUrl?: string; isActive?: boolean; description?: string; yield?: string; grossYield?: string; investors?: string; region?: string; }): Promise<Country> {
        return await this.create({
            name: data.name,
            slug: data.slug,
            continent: data.continent,
            imageUrl: data.imageUrl,
            isActive: data.isActive ?? true,
            description: data.description,
            yield: data.yield,
            grossYield: data.grossYield,
            investors: data.investors,
            region: data.region,
        });
    }

    async updateCountry(id: string, data: Partial<{ name: string; slug: string; continent: string; imageUrl: string; isActive: boolean; description: string; yield: string; grossYield: string; investors: string; region: string; }>): Promise<Country> {
        return await this.updateById(id, data);
    }

    async deleteCountry(id: string): Promise<Country> {
        return await this.deleteById(id);
    }
}
