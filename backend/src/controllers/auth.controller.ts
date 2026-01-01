/**
 * Authentication Controller
 * 
 * Handles HTTP requests for authentication endpoints.
 */

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';
import { verifyRefreshToken } from '../utils/jwt';
import {
    LoginInput,
    RegisterInput,
    ChangePasswordInput,
    RefreshTokenInput,
} from '../validators/auth.validator';

/**
 * Authentication Controller
 */
export class AuthController {
    /**
     * Register a new user
     * POST /api/v1/auth/register
     */
    register = asyncHandler(async (req: Request, res: Response) => {
        const data: RegisterInput = req.body;
        const result = await authService.register(data);

        return sendSuccess(res, result, 'User registered successfully', 201);
    });

    /**
     * Login user
     * POST /api/v1/auth/login
     */
    login = asyncHandler(async (req: Request, res: Response) => {
        const data: LoginInput = req.body;
        const result = await authService.login(data);

        return sendSuccess(res, result, 'Login successful');
    });

    /**
     * Get current user
     * GET /api/v1/auth/me
     */
    getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const user = await authService.getUserById(userId);

        return sendSuccess(res, { user }, 'User retrieved successfully');
    });

    /**
     * Refresh access token
     * POST /api/v1/auth/refresh
     */
    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const { refreshToken }: RefreshTokenInput = req.body;

        // Verify refresh token
        const payload = verifyRefreshToken(refreshToken);

        // Generate new access token
        const result = await authService.refreshToken(payload.userId);

        return sendSuccess(res, result, 'Token refreshed successfully');
    });

    /**
     * Change password
     * POST /api/v1/auth/change-password
     */
    changePassword = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const { currentPassword, newPassword }: ChangePasswordInput = req.body;

        await authService.changePassword(userId, currentPassword, newPassword);

        return sendSuccess(res, null, 'Password changed successfully');
    });

    /**
     * Logout user
     * POST /api/v1/auth/logout
     */
    logout = asyncHandler(async (req: Request, res: Response) => {
        // In a stateless JWT system, logout is handled client-side
        // by removing the tokens from storage
        // This endpoint is here for consistency and future enhancements

        return sendSuccess(res, null, 'Logout successful');
    });
}

export const authController = new AuthController();
