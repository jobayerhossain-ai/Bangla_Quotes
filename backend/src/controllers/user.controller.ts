import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';
import { Role } from '@prisma/client';

export class UserController {
    /**
     * Get all users
     * GET /api/v1/users
     */
    getAll = asyncHandler(async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const role = req.query.role as Role;
        const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

        const result = await userService.findAll(page, limit, search, role, isActive);

        return sendSuccess(res, result, 'Users retrieved successfully');
    });

    /**
     * Get user by ID
     * GET /api/v1/users/:id
     */
    getById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await userService.findById(id);

        return sendSuccess(res, user, 'User retrieved successfully');
    });

    /**
     * Update user status
     * PATCH /api/v1/users/:id/status
     */
    updateStatus = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { isActive } = req.body;

        const user = await userService.updateStatus(id, isActive);

        return sendSuccess(res, user, 'User status updated successfully');
    });

    /**
     * Update user role
     * PATCH /api/v1/users/:id/role
     */
    updateRole = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { role } = req.body;

        const user = await userService.updateRole(id, role);

        return sendSuccess(res, user, 'User role updated successfully');
    });
}

export const userController = new UserController();
