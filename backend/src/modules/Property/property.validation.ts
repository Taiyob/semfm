// src/modules/Property/property.validation.ts
import { z } from 'zod';
import { PropertyStatus, OutdoorSpace, EnergyLabel, LocationType } from '@/generated/prisma/client';

export const PropertyValidation = {
    create: z.object({
        title: z.string().min(3, 'Title must be at least 3 characters').max(255),
        description: z.string().optional(),
        location: z.string().min(2, 'Location is required'),
        region: z.string().optional(),
        countryId: z.string().uuid('Invalid country ID').optional(),
        price: z.number().positive('Price must be positive'),
        yield: z.number().min(0).max(100),
        appreciation: z.number().min(0).max(100),
        type: z.string().min(1, 'Property type is required'),
        image: z.string().url('Invalid image URL').optional().or(z.literal('')),
        sqm: z.number().positive('SQM must be positive'),
        bedrooms: z.number().int().min(0),
        status: z.nativeEnum(PropertyStatus).default(PropertyStatus.AVAILABLE),
        outdoorSpace: z.nativeEnum(OutdoorSpace).default(OutdoorSpace.NONE),
        energyLabel: z.nativeEnum(EnergyLabel).default(EnergyLabel.C),
        locationType: z.nativeEnum(LocationType).default(LocationType.CENTRE),
        condition: z.string().default('Standard'),
    }).strict(),
};

export type CreatePropertyInput = z.infer<typeof PropertyValidation.create>;
