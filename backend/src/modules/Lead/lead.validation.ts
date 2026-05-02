import { z } from 'zod';

export const LeadValidation = {
  create: z.object({
    propertyId: z.string().uuid('Invalid property ID'),
    message: z.string().max(1000).optional(),
  }),
  updateStatus: z.object({
    status: z.enum(['NEW', 'CONTACTED', 'CLOSED']),
  }),
};
