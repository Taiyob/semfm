import { z } from 'zod';
import { LeadStatus } from '@/generated/prisma/client';

export const LeadValidation = {
  create: z.object({
    propertyId: z.string().uuid('Invalid property ID'),
    message: z.string().max(1000).optional(),
    budget: z.string().optional(),
    financing: z.string().optional(),
  }),
  updateStatus: z.object({
    status: z.nativeEnum(LeadStatus),
  }),
};
