// src/modules/Property/property.service.ts
import { PrismaClient, Property } from '@/generated/prisma/client';
import { BaseService } from '@/core/BaseService';
import { CreatePropertyInput } from './property.validation';

export class PropertyService extends BaseService<Property> {
    constructor(prisma: PrismaClient) {
        super(prisma, 'Property', {
            enableSoftDelete: false,
            enableAuditFields: false,
        });
    }

    protected getModel() {
        return this.prisma.property;
    }

    /**
     * Create a new property listing
     */
    async createProperty(agentId: string, data: CreatePropertyInput): Promise<Property> {
        return this.create({
            ...data,
            agentId,
        });
    }

    /**
     * Get a single property by ID
     */
    async getPropertyById(id: string, userId?: string) {
        const property = await this.findOne({ id });
        if (!property) return null;

        let hasActiveInquiry = false;
        let isSaved = false;

        if (userId) {
            // Check active inquiry
            const lead = await this.prisma.lead.findFirst({
                where: {
                    propertyId: id,
                    userId,
                    status: { in: ['NEW', 'CONTACTED'] }
                }
            });
            hasActiveInquiry = !!lead;

            // Check if saved
            const saved = await this.prisma.user.findFirst({
                where: {
                    id: userId,
                    savedProperties: { some: { id } }
                }
            });
            isSaved = !!saved;
        }

        return {
            ...property,
            hasActiveInquiry,
            isSaved
        };
    }

    /**
     * Toggle save property (Save/Unsave)
     */
    async toggleSaveProperty(userId: string, propertyId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { savedProperties: { select: { id: true } } }
        });

        if (!user) throw new Error('User not found');

        const isAlreadySaved = user.savedProperties.some(p => p.id === propertyId);

        if (isAlreadySaved) {
            // Unsave
            return this.prisma.user.update({
                where: { id: userId },
                data: {
                    savedProperties: { disconnect: { id: propertyId } }
                }
            });
        } else {
            // Save
            return this.prisma.user.update({
                where: { id: userId },
                data: {
                    savedProperties: { connect: { id: propertyId } }
                }
            });
        }
    }

    /**
     * Get all saved properties for a user
     */
    async getSavedProperties(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                savedProperties: {
                    include: {
                        country: true
                    }
                }
            }
        });

        return user?.savedProperties || [];
    }

    /**
     * Get all properties (public)
     */
    async getAllProperties(query: any, userId?: string) {
        const { page = 1, limit = 10, ...filters } = query;
        const skip = (Number(page) - 1) * Number(limit);

        const where: any = {
            ...filters,
        };

        const [data, total] = await Promise.all([
            this.prisma.property.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    country: true,
                }
            }),
            this.prisma.property.count({ where }),
        ]);

        // If userId is provided, check which properties are saved
        let savedPropertyIds: string[] = [];
        if (userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { savedProperties: { select: { id: true } } }
            });
            savedPropertyIds = user?.savedProperties.map(p => p.id) || [];
        }

        const propertiesWithSavedStatus = data.map(property => ({
            ...property,
            isSaved: savedPropertyIds.includes(property.id)
        }));

        return {
            data: propertiesWithSavedStatus,
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
        };
    }

    /**
     * Get properties listed by the current agent
     */
    async getMyProperties(agentId: string, query: any) {
        const { page, limit } = query;
        return this.findMany(
            { agentId },
            { page: Number(page) || 1, limit: Number(limit) || 10 },
            { createdAt: 'desc' }
        );
    }

    /**
     * Increment property view count
     */
    async incrementViews(id: string) {
        return this.prisma.property.update({
            where: { id },
            data: { views: { increment: 1 } }
        });
    }

    /**
     * Increment property lead count
     */
    async incrementLeads(id: string) {
        return this.prisma.property.update({
            where: { id },
            data: { leads: { increment: 1 } }
        });
    }

    /**
     * Update a property listing
     */
    async updateProperty(id: string, agentId: string, updateData: any) {
        // Log for debugging
        console.log(`Updating property ${id} for agent ${agentId} with data:`, updateData);

        // Ensure property belongs to agent
        const property = await this.prisma.property.findFirst({ 
            where: { id, agentId } 
        });
        if (!property) {
            console.warn(`Property ${id} not found for agent ${agentId}`);
            return null;
        }

        // Strip out id and other sensitive fields that shouldn't be updated directly via this body
        const { id: _, agentId: __, createdAt: ___, updatedAt: ____, ...cleanData } = updateData || {};

        // If no data to update, just return the property
        if (Object.keys(cleanData).length === 0) {
            return property;
        }

        return this.prisma.property.update({
            where: { id },
            data: cleanData
        });
    }

    /**
     * Delete a property listing
     */
    async deleteProperty(id: string, agentId: string) {
        // Ensure property belongs to agent
        const property = await this.prisma.property.findFirst({ 
            where: { id, agentId } 
        });
        if (!property) return null;

        return this.prisma.property.delete({
            where: { id }
        });
    }
}
