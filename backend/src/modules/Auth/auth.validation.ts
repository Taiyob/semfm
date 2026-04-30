// src/modules/Auth/auth.validation.ts
import { z } from 'zod';

// Password validation with security requirements
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must not exceed 128 characters');

// Account type mapping to role
const accountTypeSchema = z.enum(['investor', 'agent'], 'Account type must be investor or agent');

// Email validation helper
const emailSchema = z
    .string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim();

export const AuthValidation = {
    // Registration validation
    register: z
        .object({
            name: z
                .string()
                .min(2, 'Name must be at least 2 characters')
                .max(100, 'Name cannot exceed 100 characters')
                .trim(),
            email: emailSchema,
            password: passwordSchema,
            accountType: z.enum(['investor', 'agent'] as const, {
                message: "Account type must be 'investor' or 'agent'",
            }),
        })
        .strict(),

    // Login validation
    login: z
        .object({
            email: emailSchema,
            password: z.string().min(1, 'Password is required'),
        })
        .strict(),

    // Parameter validation
    params: {
        userId: z.object({
            userId: z.string().min(1, 'User ID is required').uuid('User ID must be a valid UUID'),
        }),
    },
};

// Type exports
export type RegisterInput = z.infer<typeof AuthValidation.register>;
export type LoginInput = z.infer<typeof AuthValidation.login>;
export type UserIdParams = z.infer<typeof AuthValidation.params.userId>;