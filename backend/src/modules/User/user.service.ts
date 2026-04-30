// src/modules/User/user.service.ts
import { PrismaClient, User } from '@/generated/prisma/client';
import { BaseService } from '@/core/BaseService';
import { UpdateProfileInput } from './user.validation';

export class UserService extends BaseService<User> {
    constructor(prisma: PrismaClient) {
        super(prisma, 'User', {
            enableSoftDelete: true,
            enableAuditFields: true,
        });
    }

    protected getModel() {
        return this.prisma.user;
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: UpdateProfileInput): Promise<User> {
        return this.updateById(userId, data);
    }
}
