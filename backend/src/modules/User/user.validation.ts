// src/modules/User/user.validation.ts
import { z } from 'zod';

export const UserValidation = {
    updateProfile: z.object({
        firstName: z.string().min(1, 'First name is required').max(100).optional(),
        lastName: z.string().min(1, 'Last name is required').max(100).optional(),
        displayName: z.string().min(1, 'Display name is required').max(100).optional(),
        bio: z.string().max(500).optional(),
        avatarUrl: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
    }).strict(),
};

export type UpdateProfileInput = z.infer<typeof UserValidation.updateProfile>;
