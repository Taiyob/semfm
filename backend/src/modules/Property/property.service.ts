import { PrismaClient, Property } from '@/generated/prisma/client';
import { BaseService } from '@/core/BaseService';
import { CreatePropertyInput } from './property.validation';
import { AlertService } from '../Alert/alert.service';

export class PropertyService extends BaseService<Property> {
    private alertService?: AlertService;

    constructor(prisma: PrismaClient, alertService?: AlertService) {
        super(prisma, 'Property', {
            enableSoftDelete: false,
            enableAuditFields: false,
        });
        this.alertService = alertService;
    }

    protected getModel() {
        return this.prisma.property;
    }

    /**
     * Create a new property listing
     */
    async createProperty(agentId: string, data: CreatePropertyInput): Promise<Property> {
        const property = await this.create({
            ...data,
            agentId,
        });

        // Trigger matching alerts
        if (this.alertService) {
            this.alertService.processPropertyAgainstAlerts(property).catch(err => {
                console.error('Error processing alerts for property:', err);
            });
        }

        return property;
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
        const { 
            page = 1, limit = 10, search, sortBy, sortOrder,
            country, city, type, condition, energyLabel, outdoorSpace,
            minPrice, maxPrice, minYear, maxYear, bathrooms, amenities
        } = query;
        const skip = (Number(page) - 1) * Number(limit);

        const where: any = {};

        // 1. Basic Exact Matches
        if (country && country !== 'All') {
            where.location = { contains: country, mode: 'insensitive' };
        }
        if (city && city !== 'All') {
            where.location = { ...where.location, contains: city, mode: 'insensitive' };
        }
        if (type && type !== 'All') where.type = type;
        if (condition && condition !== 'All') where.condition = condition;
        if (energyLabel && energyLabel !== 'All') where.energyLabel = energyLabel;
        if (outdoorSpace && outdoorSpace !== 'All') {
            where.outdoorSpace = { not: 'NONE' };
        }

        // 2. Numeric Matches & Ranges
        if (bathrooms && bathrooms !== 'All') {
            if (bathrooms === '5+') {
                where.bedrooms = { gte: 5 };
            } else {
                where.bedrooms = Number(bathrooms);
            }
        }

        if (minPrice !== undefined && minPrice !== '') {
            where.price = { ...where.price, gte: Number(minPrice) };
        }
        if (maxPrice !== undefined && maxPrice !== '') {
            where.price = { ...where.price, lte: Number(maxPrice) };
        }

        if (minYear !== undefined && minYear !== '') {
            where.yearBuilt = { ...where.yearBuilt, gte: Number(minYear) };
        }
        if (maxYear !== undefined && maxYear !== '') {
            where.yearBuilt = { ...where.yearBuilt, lte: Number(maxYear) };
        }

        // 3. Arrays (Amenities)
        if (amenities) {
            let amenitiesArr = [];
            if (typeof amenities === 'string') {
                amenitiesArr = amenities.split(',');
            } else if (Array.isArray(amenities)) {
                amenitiesArr = amenities;
            }
            if (amenitiesArr.length > 0) {
                where.features = { hasEvery: amenitiesArr };
            }
        }

        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { location: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        let orderBy: any = { createdAt: 'desc' };
        if (sortBy && sortOrder) {
            orderBy = { [sortBy as string]: sortOrder };
        }

        const [data, total] = await Promise.all([
            this.prisma.property.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy,
                include: {
                    country: true,
                    agent: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    }
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

        const totalPages = Math.ceil(total / Number(limit));
        const currentPage = Number(page);

        return {
            data: propertiesWithSavedStatus,
            total,
            page: currentPage,
            limit: Number(limit),
            totalPages,
            hasNext: currentPage < totalPages,
            hasPrevious: currentPage > 1,
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
    async updateProperty(id: string, agentId: string, updateData: any, isAdmin: boolean = false) {
        // Log for debugging
        console.log(`Updating property ${id} for user ${agentId} (Admin: ${isAdmin}) with data:`, updateData);

        // Ensure property belongs to agent or user is admin
        const whereClause = isAdmin ? { id } : { id, agentId };
        const property = await this.prisma.property.findFirst({ 
            where: whereClause 
        });
        if (!property) {
            console.warn(`Property ${id} not found or permission denied for user ${agentId}`);
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
    async deleteProperty(id: string, agentId: string, isAdmin: boolean = false) {
        // Ensure property belongs to agent or user is admin
        const whereClause = isAdmin ? { id } : { id, agentId };
        const property = await this.prisma.property.findFirst({ 
            where: whereClause 
        });
        if (!property) return null;

        return this.prisma.property.delete({
            where: { id }
        });
    }
}
