import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '@/core/errors/AppError';

export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AuthenticationError('You are not logged in.'));
        }

        // Assuming user.role contains the role name or object
        const userRole = typeof req.user.role === 'string' ? req.user.role : req.user.role?.name;
        
        if (!userRole || !roles.includes(userRole)) {
            return next(new AuthenticationError('You do not have permission to perform this action.'));
        }

        next();
    };
};
