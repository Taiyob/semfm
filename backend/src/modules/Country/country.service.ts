import { BaseService } from '@/core/BaseService';
import { Country } from '@/generated/prisma';

export class CountryService extends BaseService<Country> {
    constructor(prisma: any) {
        super(prisma, 'Country');
    }

    protected getModel() {
        return this.prisma.country;
    }

    async createCountry(data: { name: string; slug: string; continent?: string; imageUrl?: string; isActive?: boolean }): Promise<Country> {
        return await this.create({
            name: data.name,
            slug: data.slug,
            continent: data.continent,
            imageUrl: data.imageUrl,
            isActive: data.isActive ?? true,
        });
    }

    async updateCountry(id: string, data: Partial<{ name: string; slug: string; continent: string; imageUrl: string; isActive: boolean }>): Promise<Country> {
        return await this.updateById(id, data);
    }

    async deleteCountry(id: string): Promise<Country> {
        return await this.deleteById(id);
    }
}
