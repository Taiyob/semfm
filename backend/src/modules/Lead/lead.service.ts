import { PrismaClient, Lead, LeadStatus } from '@/generated/prisma/client';
import { BaseService } from '@/core/BaseService';

export class LeadService extends BaseService<Lead> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'Lead', {
      enableSoftDelete: false,
      enableAuditFields: false,
    });
  }

  protected getModel() {
    return this.prisma.lead;
  }

  async createLead(data: { propertyId: string; userId: string; message?: string }) {
    // 1. Check if a lead already exists for this user and property
    const existingLead = await this.prisma.lead.findFirst({
      where: {
        propertyId: data.propertyId,
        userId: data.userId,
      },
    });

    if (existingLead) {
      // If it exists, just return the existing lead
      return existingLead;
    }

    // 2. Get the property to find the agentId
    const property = await this.prisma.property.findUnique({
      where: { id: data.propertyId },
      select: { agentId: true },
    });

    if (!property || !property.agentId) {
      throw new Error('Property not found or has no assigned agent');
    }

    // 3. Create the lead
    const lead = await this.prisma.lead.create({
      data: {
        propertyId: data.propertyId,
        userId: data.userId,
        agentId: property.agentId,
        message: data.message,
        status: LeadStatus.NEW,
      },
      include: {
        property: {
          select: { title: true, location: true }
        },
        user: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    // 4. Increment the lead count on the property
    await this.prisma.property.update({
      where: { id: data.propertyId },
      data: { leads: { increment: 1 } },
    });

    return lead;
  }

  async getLeadsByAgent(agentId: string) {
    return this.prisma.lead.findMany({
      where: { agentId },
      include: {
        property: {
          select: { title: true, location: true }
        },
        user: {
          select: { firstName: true, lastName: true, email: true, avatarUrl: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLeadStatus(id: string, agentId: string, status: LeadStatus) {
    // Ensure the lead belongs to the agent
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { property: true }
    });

    if (!lead || lead.agentId !== agentId) {
      throw new Error('Lead not found or unauthorized');
    }

    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: { status },
    });

    // If deal is closed, automatically add to investor's portfolio
    if (status === LeadStatus.CLOSED && lead.property) {
      const property = lead.property;
      console.log(`[Automation] Lead ${id} closed. Attempting to create investment for user ${lead.userId}`);
      
      try {
        // Check if already added for THIS property to avoid duplicates
        const existing = await this.prisma.investment.findFirst({
          where: {
            userId: lead.userId,
            assetName: property.title,
            amount: property.price
          }
        });

        if (!existing) {
          // Map PropertyType to AssetType
          let assetType: any = 'RESIDENTIAL';
          const typeLower = (property.type || '').toLowerCase();
          if (typeLower.includes('villa') || typeLower.includes('penthouse') || typeLower.includes('luxury')) {
            assetType = 'LUXURY';
          }

          await this.prisma.investment.create({
            data: {
              userId: lead.userId,
              countryId: property.countryId,
              assetName: property.title,
              amount: property.price,
              growth: 0,
              growthPerc: 0,
              status: 'GROWING',
              type: assetType
            }
          });
          console.log(`[Automation] SUCCESS: Created investment for user ${lead.userId}`);
        } else {
          console.log(`[Automation] SKIP: Investment already exists for user ${lead.userId}`);
        }
      } catch (invError) {
        console.error('[Automation] FAILED to create investment:', invError);
      }
    }

    return updatedLead;
  }

  async getLeadById(id: string, agentId: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        property: true,
        user: {
          select: { firstName: true, lastName: true, email: true, avatarUrl: true }
        }
      },
    });

    if (!lead || lead.agentId !== agentId) {
      throw new Error('Lead not found or unauthorized');
    }

    return lead;
  }

  async deleteLead(id: string, agentId: string) {
    // Ensure the lead belongs to the agent
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    });

    if (!lead || lead.agentId !== agentId) {
      throw new Error('Lead not found or unauthorized');
    }

    return this.prisma.lead.delete({
      where: { id },
    });
  }
}
