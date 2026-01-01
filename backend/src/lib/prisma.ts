import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Soft delete middleware
prisma.$use(async (params, next) => {
    // Check if the model has a deletedAt field
    const modelsWithSoftDelete = ['User', 'Category', 'Quote', 'StudioAsset'];

    if (params.model && modelsWithSoftDelete.includes(params.model)) {
        if (params.action === 'delete') {
            // Change action to an update
            params.action = 'update';
            params.args['data'] = { deletedAt: new Date() };
        }
        if (params.action === 'deleteMany') {
            // Change action to an updateMany
            params.action = 'updateMany';
            if (params.args.data !== undefined) {
                params.args.data['deletedAt'] = new Date();
            } else {
                params.args['data'] = { deletedAt: new Date() };
            }
        }
    }

    // Handle finding - exclude soft deleted records
    if (params.model && modelsWithSoftDelete.includes(params.model)) {
        if (params.action === 'findUnique' || params.action === 'findFirst') {
            // Change to findFirst - you cannot filter by deletedAt on findUnique
            params.action = 'findFirst';
            params.args.where['deletedAt'] = null;
        }
        if (params.action === 'findMany') {
            if (params.args.where) {
                if (params.args.where.deletedAt === undefined) {
                    params.args.where['deletedAt'] = null;
                }
            } else {
                params.args['where'] = { deletedAt: null };
            }
        }
    }

    return next(params);
});
