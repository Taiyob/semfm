// src/modules/Auth/auth.service.ts
import { PrismaClient, User, AccountStatus } from '@/generated/prisma/client';
import { BaseService } from '@/core/BaseService';
import { AppLogger } from '@/core/logging/logger';
import { AppError, ConflictError, AuthenticationError } from '@/core/errors/AppError';
import { RegisterInput, LoginInput } from './auth.validation';
import { hashPassword, comparePassword } from '@/utils/hash';
import { generateToken } from '@/utils/jwt';
import { HTTPStatusCode } from '@/types/HTTPStatusCode';

export class AuthService extends BaseService<User> {    constructor(prisma: PrismaClient) {
        super(prisma, 'User', {
            enableSoftDelete: true,
            enableAuditFields: true,
        });
    }

    protected getModel() {
        return this.prisma.user;
    }

    /**
     * Register a new user
     */
    async register(data: RegisterInput): Promise<{ message: string; requiresVerification: boolean }> {
        const { name, email, password, accountType } = data;

        // Check if user already exists
        const existingUser = await this.findOne({ email });

        if (existingUser) {
            throw new ConflictError('User with this email already exists');
        }

        // Split name
        const nameParts = name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        // Determine role based on accountType
        const roleName = accountType === 'agent' ? 'agent' : 'investor';

        // Check if role exists, if not fallback to hardcoded creation
        let role = await this.prisma.role.findUnique({ where: { name: roleName } });
        if (!role) {
            role = await this.prisma.role.create({
                data: {
                    name: roleName,
                    description: `System generated ${roleName} role`
                }
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await this.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            displayName: name,
            status: AccountStatus.active,
            roleId: role.id,
        });

        AppLogger.info('User registered successfully', {
            userId: user.id,
            email: user.email,
            role: role.name,
        });

        return {
            message: 'Registration successful. You can now login.',
            requiresVerification: false,
        };
    }

    /**
     * Login user
     */
    async login(data: LoginInput) {
        const { email, password } = data;

        // Find user with role
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });

        if (!user) {
            throw new AuthenticationError('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new AuthenticationError('Invalid credentials');
        }

        if (user.status !== AccountStatus.active) {
            throw new AuthenticationError(`Account is ${user.status}`);
        }

        // Generate JWT
        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role.name,
        });

        AppLogger.info('User logged in successfully', {
            userId: user.id,
            email: user.email,
        });

        // Omit password from response
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token,
        };
    }
}