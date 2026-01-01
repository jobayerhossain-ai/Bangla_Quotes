/**
 * Authentication Service
 * 
 * Business logic for user authentication and authorization.
 */

import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError';
import { generateTokens, TokenPayload } from '../utils/jwt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    user: Omit<User, 'password'>;
    accessToken: string;
    refreshToken: string;
}

/**
 * Authentication Service
 */
export class AuthService {
    /**
     * Register a new user
     */
    async register(data: RegisterDTO): Promise<AuthResponse> {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw ApiError.conflict('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: 'USER',
            },
        });

        // Generate tokens
        const tokens = this.generateUserTokens(user);

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            ...tokens,
        };
    }

    /**
     * Login user
     */
    async login(data: LoginDTO): Promise<AuthResponse> {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        // Check if user is active
        if (!user.isActive) {
            throw ApiError.forbidden('Your account has been deactivated');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            throw ApiError.unauthorized('Invalid email or password');
        }

        // Generate tokens
        const tokens = this.generateUserTokens(user);

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            ...tokens,
        };
    }

    /**
     * Get user by ID
     */
    async getUserById(userId: string): Promise<Omit<User, 'password'>> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Refresh access token
     */
    async refreshToken(userId: string): Promise<{ accessToken: string }> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw ApiError.unauthorized('User not found');
        }

        if (!user.isActive) {
            throw ApiError.forbidden('User account is inactive');
        }

        const payload: TokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        const tokens = generateTokens(payload);

        return {
            accessToken: tokens.accessToken,
        };
    }

    /**
     * Change password
     */
    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            throw ApiError.unauthorized('Current password is incorrect');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }

    /**
     * Generate tokens for user
     */
    private generateUserTokens(user: User) {
        const payload: TokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };

        return generateTokens(payload);
    }
}

export const authService = new AuthService();
