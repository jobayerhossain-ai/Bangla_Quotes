
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
    const email = 'admin@banglaquotes.com';
    const password = 'Admin@123456';

    console.log(`Resetting password for ${email}...`);

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                isActive: true,
                role: 'SUPER_ADMIN'
            },
            create: {
                email,
                password: hashedPassword,
                name: 'Admin',
                role: 'SUPER_ADMIN',
                isActive: true,
            },
        });
        console.log('✅ Admin user reset successfully');
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${password}`);
    } catch (error) {
        console.error('❌ Failed to reset admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
