import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '@/core/errors/AppError';
import { verifyToken } from '@/utils/jwt';
import { prisma } from '@/lib/prisma';
import { catchAsync } from '@/utils/catchAsync';

export const authMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Check for token in cookies or Authorization header
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new AuthenticationError('You are not logged in. Please log in to get access.');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const currentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: { role: true },
    });

    if (!currentUser) {
        throw new AuthenticationError('The user belonging to this token does no longer exist.');
    }

    // Check if user is active
    if (currentUser.status !== 'active') {
        throw new AuthenticationError('User account is not active.');
    }

    // Exclude password
    const { password: _, ...userWithoutPassword } = currentUser;

    // Grant access to protected route
    req.user = userWithoutPassword;
    next();
});

export const optionalAuthMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next();

    try {
        const decoded = verifyToken(token);
        const currentUser = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { role: true },
        });

        if (currentUser && currentUser.status === 'active') {
            const { password: _, ...userWithoutPassword } = currentUser;
            req.user = userWithoutPassword;
        }
    } catch (err) {
        // Silently fail for optional auth
    }
    next();
});
