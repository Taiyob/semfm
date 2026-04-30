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
    async getPropertyById(id: string) {
        return this.findOne({ id });
    }

    /**
     * Get all properties (public)
     */
    async getAllProperties(query: any) {
        const { page, limit, ...filters } = query;
        return this.findMany(
            filters,
            { page: Number(page) || 1, limit: Number(limit) || 10 },
            { createdAt: 'desc' }
        );
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
