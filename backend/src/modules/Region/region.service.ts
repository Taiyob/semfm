import { PrismaClient } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export class RegionService {
    async getAllRegions() {
        return await prisma.region.findMany({
            include: { country: true },
            orderBy: { name: 'asc' }
        });
    }

    async createRegion(data: any) {
        return await prisma.region.create({ data });
    }

    async updateRegion(id: string, data: any) {
        return await prisma.region.update({
            where: { id },
            data
        });
    }

    async deleteRegion(id: string) {
        return await prisma.region.delete({
            where: { id }
        });
    }
}
