import { prisma } from '../lib/prisma';

export class SettingsService {
    /**
     * Get all feature toggles
     */
    async getFeatureToggles() {
        return prisma.featureToggle.findMany({
            orderBy: { key: 'asc' }
        });
    }

    /**
     * Update feature toggle
     */
    async updateFeatureToggle(key: string, isEnabled: boolean, updatedBy: string) {
        return prisma.featureToggle.upsert({
            where: { key },
            update: { isEnabled, updatedBy },
            create: { key, isEnabled, updatedBy }
        });
    }

    /**
     * Initialize default feature toggles
     */
    async initializeFeatureToggles() {
        const defaultToggles = [
            { key: 'DOWNLOAD_ENABLED', description: 'Allow users to download quotes', isEnabled: true },
            { key: 'SHARE_ENABLED', description: 'Allow users to share quotes', isEnabled: true },
            { key: 'WATERMARK_ENABLED', description: 'Add watermark to downloaded images', isEnabled: false },
            { key: 'LOGIN_REQUIRED', description: 'Require login to access features', isEnabled: false },
            { key: 'ADS_ENABLED', description: 'Show advertisements', isEnabled: false },
            { key: 'PREMIUM_FEATURES', description: 'Enable premium features', isEnabled: false },
        ];

        for (const toggle of defaultToggles) {
            await prisma.featureToggle.upsert({
                where: { key: toggle.key },
                update: {},
                create: toggle
            });
        }

        return this.getFeatureToggles();
    }

    // ========================================================================
    // GENERAL SETTINGS
    // ========================================================================

    /**
     * Get all settings (optionally filtered by group)
     */
    async getSettings(group?: string) {
        return prisma.setting.findMany({
            where: group ? { group } : undefined,
            orderBy: { key: 'asc' }
        });
    }

    /**
     * Get public settings (for frontend)
     */
    async getPublicSettings() {
        return prisma.setting.findMany({
            where: { isPublic: true },
            orderBy: { key: 'asc' }
        });
    }

    /**
     * Upsert a setting
     */
    async upsertSetting(data: { key: string; value: string; type?: string; group?: string; isPublic?: boolean; description?: string }) {
        const { key, value, type, group, isPublic, description } = data;
        return prisma.setting.upsert({
            where: { key },
            update: { value, type, group, isPublic, description },
            create: { key, value, type, group, isPublic, description }
        });
    }
}

export const settingsService = new SettingsService();
