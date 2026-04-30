import jwt from 'jsonwebtoken';
import { config } from '../core/config';
import { AppError } from '../core/errors/AppError';
import { HTTPStatusCode } from '../types/HTTPStatusCode';

export interface JwtPayload {
    id: string;
    email: string;
    role: string;
}

export const generateToken = (payload: JwtPayload): string => {
    if (!config.security.jwt.secret) {
        throw new AppError({
            statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
            message: 'JWT_SECRET is not defined',
        });
    }

    return jwt.sign(payload, config.security.jwt.secret as string, {
        expiresIn: config.security.jwt.expiresIn as any,
        issuer: config.security.jwt.issuer,
    });
};

export const verifyToken = (token: string): JwtPayload => {
    if (!config.security.jwt.secret) {
        throw new AppError({
            statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
            message: 'JWT_SECRET is not defined',
        });
    }

    try {
        return jwt.verify(token, config.security.jwt.secret as string) as JwtPayload;
    } catch (error) {
        throw new AppError({
            statusCode: HTTPStatusCode.UNAUTHORIZED,
            message: 'Invalid or expired token',
            code: 'INVALID_TOKEN',
        });
    }
};
