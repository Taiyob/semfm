import { Request, Response, NextFunction } from 'express';
import { BaseController } from '@/core/BaseController';
import { AuthService } from './auth.service';
import { catchAsync } from '@/utils/catchAsync';

export class AuthController extends BaseController {
    constructor(private authService: AuthService) {
        super();
    }

    private setTokenCookie(res: Response, token: string) {
        // Ensure to import config if needed, but we can rely on NODE_ENV
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax', // Now same-site due to proxy
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
    }

    /**
     * @route POST /api/auth/login
     * @desc Authenticate user and get token
     */
    public login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await this.authService.login(req.body);
        
        // Extract token and user from result
        const { token, user } = result as any;
        
        // Set HTTP-only cookie
        this.setTokenCookie(res, token);

        return this.sendResponse(req, res, 'Login successful', undefined, { user });
    });

    /**
     * Register a new user
     * POST /api/auth/register
     */
    public register = catchAsync(async (req: Request, res: Response) => {
        const body = req.body;
        const result = await this.authService.register(body);
        
        // The current register method might not return a token.
        // If it doesn't, they just login after. But if we want auto-login, we need the token.
        // For now, let's just return the response.
        return this.sendCreatedResponse(req, res, result, 'User registered successfully');
    });

    /**
     * @route POST /api/auth/logout
     * @desc Clear authentication cookies
     */
    public logout = catchAsync(async (req: Request, res: Response) => {
        const isProduction = process.env.NODE_ENV === 'production';
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
        });
        
        return this.sendResponse(req, res, 'Logged out successfully');
    });

    /**
     * @route GET /api/auth/me
     * @desc Get current logged in user
     */
    public getMe = catchAsync(async (req: Request, res: Response) => {
        return this.sendResponse(req, res, 'User details retrieved successfully', undefined, { user: req.user });
    });
}
