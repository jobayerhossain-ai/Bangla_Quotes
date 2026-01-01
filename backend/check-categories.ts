import { PrismaClient } from '@prisma/client';

console.log('🔌 CHECK SCRIPT DB URL:', process.env.DATABASE_URL);
const prisma = new PrismaClient();

async function checkCategories() {
    try {
        const count = await prisma.category.count();
        console.log(`Total categories in database: ${count}`);

        if (count > 0) {
            const categories = await prisma.category.findMany({
                take: 5,
                select: {
                    id: true,
                    nameBn: true,
                    nameEn: true,
                    slug: true,
                    order: true,
                }
            });
            console.log('\nFirst 5 categories:');
            console.log(JSON.stringify(categories, null, 2));
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkCategories();
