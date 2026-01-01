/**
 * Database Seed Script
 * 
 * Seeds the database with initial data for development.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main() {
    console.log('🌱 Starting database seed...');

    // ============================================================================
    // SEED ADMIN USER
    // ============================================================================

    console.log('\n📝 Seeding admin user...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@banglaquotes.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Admin',
            role: 'SUPER_ADMIN',
            isActive: true,
        },
    });

    console.log(`✅ Admin user created: ${admin.email}`);

    // ============================================================================
    // SEED CATEGORIES
    // ============================================================================

    console.log('\n📂 Seeding categories...');

    const categories = [
        // Life & Philosophy (জীবন ও দর্শন)
        {
            nameBn: 'জীবন',
            nameEn: 'Life',
            slug: 'life',
            description: 'জীবন নিয়ে উক্তি ও দর্শন',
            order: 1,
        },
        {
            nameBn: 'অনুপ্রেরণা',
            nameEn: 'Inspiration',
            slug: 'inspiration',
            description: 'অনুপ্রেরণামূলক ও উৎসাহব্যঞ্জক উক্তি',
            order: 2,
        },
        {
            nameBn: 'সফলতা',
            nameEn: 'Success',
            slug: 'success',
            description: 'সফলতা ও কৃতিত্ব নিয়ে উক্তি',
            order: 3,
        },
        {
            nameBn: 'স্বপ্ন',
            nameEn: 'Dreams',
            slug: 'dreams',
            description: 'স্বপ্ন ও লক্ষ্য নিয়ে উক্তি',
            order: 4,
        },
        {
            nameBn: 'পরিশ্রম',
            nameEn: 'Hard Work',
            slug: 'hard-work',
            description: 'পরিশ্রম ও কঠোর সাধনা নিয়ে উক্তি',
            order: 5,
        },
        {
            nameBn: 'ধৈর্য',
            nameEn: 'Patience',
            slug: 'patience',
            description: 'ধৈর্য ও সহনশীলতা নিয়ে উক্তি',
            order: 6,
        },
        {
            nameBn: 'সময়',
            nameEn: 'Time',
            slug: 'time',
            description: 'সময় ও সময়ের মূল্য নিয়ে উক্তি',
            order: 7,
        },
        {
            nameBn: 'পরিবর্তন',
            nameEn: 'Change',
            slug: 'change',
            description: 'পরিবর্তন ও রূপান্তর নিয়ে উক্তি',
            order: 8,
        },

        // Emotions & Feelings (আবেগ ও অনুভূতি)
        {
            nameBn: 'ভালোবাসা',
            nameEn: 'Love',
            slug: 'love',
            description: 'ভালোবাসা ও প্রেম নিয়ে উক্তি',
            order: 9,
        },
        {
            nameBn: 'বিরহ',
            nameEn: 'Separation',
            slug: 'separation',
            description: 'বিরহ ও বিচ্ছেদ নিয়ে উক্তি',
            order: 10,
        },
        {
            nameBn: 'আনন্দ',
            nameEn: 'Happiness',
            slug: 'happiness',
            description: 'আনন্দ ও খুশি নিয়ে উক্তি',
            order: 11,
        },
        {
            nameBn: 'দুঃখ',
            nameEn: 'Sadness',
            slug: 'sadness',
            description: 'দুঃখ ও বেদনা নিয়ে উক্তি',
            order: 12,
        },
        {
            nameBn: 'একাকীত্ব',
            nameEn: 'Loneliness',
            slug: 'loneliness',
            description: 'একাকীত্ব ও নিঃসঙ্গতা নিয়ে উক্তি',
            order: 13,
        },
        {
            nameBn: 'আশা',
            nameEn: 'Hope',
            slug: 'hope',
            description: 'আশা ও প্রত্যাশা নিয়ে উক্তি',
            order: 14,
        },
        {
            nameBn: 'ভয়',
            nameEn: 'Fear',
            slug: 'fear',
            description: 'ভয় ও সাহস নিয়ে উক্তি',
            order: 15,
        },

        // Relationships (সম্পর্ক)
        {
            nameBn: 'বন্ধুত্ব',
            nameEn: 'Friendship',
            slug: 'friendship',
            description: 'বন্ধুত্ব ও বন্ধুবান্ধব নিয়ে উক্তি',
            order: 16,
        },
        {
            nameBn: 'পরিবার',
            nameEn: 'Family',
            slug: 'family',
            description: 'পরিবার ও আত্মীয়তা নিয়ে উক্তি',
            order: 17,
        },
        {
            nameBn: 'মা',
            nameEn: 'Mother',
            slug: 'mother',
            description: 'মা ও মাতৃত্ব নিয়ে উক্তি',
            order: 18,
        },
        {
            nameBn: 'বাবা',
            nameEn: 'Father',
            slug: 'father',
            description: 'বাবা ও পিতৃত্ব নিয়ে উক্তি',
            order: 19,
        },
        {
            nameBn: 'বিশ্বাস',
            nameEn: 'Trust',
            slug: 'trust',
            description: 'বিশ্বাস ও আস্থা নিয়ে উক্তি',
            order: 20,
        },
        {
            nameBn: 'বিশ্বাসঘাতকতা',
            nameEn: 'Betrayal',
            slug: 'betrayal',
            description: 'বিশ্বাসঘাতকতা ও প্রতারণা নিয়ে উক্তি',
            order: 21,
        },

        // Knowledge & Learning (জ্ঞান ও শিক্ষা)
        {
            nameBn: 'শিক্ষা',
            nameEn: 'Education',
            slug: 'education',
            description: 'শিক্ষা ও জ্ঞান নিয়ে উক্তি',
            order: 22,
        },
        {
            nameBn: 'বই',
            nameEn: 'Books',
            slug: 'books',
            description: 'বই ও পড়াশোনা নিয়ে উক্তি',
            order: 23,
        },
        {
            nameBn: 'জ্ঞান',
            nameEn: 'Knowledge',
            slug: 'knowledge',
            description: 'জ্ঞান ও প্রজ্ঞা নিয়ে উক্তি',
            order: 24,
        },
        {
            nameBn: 'শিক্ষক',
            nameEn: 'Teacher',
            slug: 'teacher',
            description: 'শিক্ষক ও গুরু নিয়ে উক্তি',
            order: 25,
        },

        // Spirituality & Religion (আধ্যাত্মিকতা ও ধর্ম)
        {
            nameBn: 'ধর্ম',
            nameEn: 'Religion',
            slug: 'religion',
            description: 'ধর্ম ও বিশ্বাস নিয়ে উক্তি',
            order: 26,
        },
        {
            nameBn: 'আল্লাহ',
            nameEn: 'Allah',
            slug: 'allah',
            description: 'আল্লাহ ও স্রষ্টা নিয়ে উক্তি',
            order: 27,
        },
        {
            nameBn: 'নামাজ',
            nameEn: 'Prayer',
            slug: 'prayer',
            description: 'নামাজ ও প্রার্থনা নিয়ে উক্তি',
            order: 28,
        },
        {
            nameBn: 'কোরআন',
            nameEn: 'Quran',
            slug: 'quran',
            description: 'কোরআন ও হাদিস নিয়ে উক্তি',
            order: 29,
        },
        {
            nameBn: 'ইসলাম',
            nameEn: 'Islam',
            slug: 'islam',
            description: 'ইসলাম ও ইসলামিক জীবনযাপন নিয়ে উক্তি',
            order: 30,
        },

        // Society & Values (সমাজ ও মূল্যবোধ)
        {
            nameBn: 'সমাজ',
            nameEn: 'Society',
            slug: 'society',
            description: 'সমাজ ও সামাজিকতা নিয়ে উক্তি',
            order: 31,
        },
        {
            nameBn: 'নৈতিকতা',
            nameEn: 'Morality',
            slug: 'morality',
            description: 'নৈতিকতা ও সততা নিয়ে উক্তি',
            order: 32,
        },
        {
            nameBn: 'দয়া',
            nameEn: 'Kindness',
            slug: 'kindness',
            description: 'দয়া ও করুণা নিয়ে উক্তি',
            order: 33,
        },
        {
            nameBn: 'ক্ষমা',
            nameEn: 'Forgiveness',
            slug: 'forgiveness',
            description: 'ক্ষমা ও মার্জনা নিয়ে উক্তি',
            order: 34,
        },
        {
            nameBn: 'ন্যায়',
            nameEn: 'Justice',
            slug: 'justice',
            description: 'ন্যায় ও ন্যায়বিচার নিয়ে উক্তি',
            order: 35,
        },

        // Nature & Beauty (প্রকৃতি ও সৌন্দর্য)
        {
            nameBn: 'প্রকৃতি',
            nameEn: 'Nature',
            slug: 'nature',
            description: 'প্রকৃতি ও পরিবেশ নিয়ে উক্তি',
            order: 36,
        },
        {
            nameBn: 'সৌন্দর্য',
            nameEn: 'Beauty',
            slug: 'beauty',
            description: 'সৌন্দর্য ও রূপ নিয়ে উক্তি',
            order: 37,
        },
        {
            nameBn: 'বৃষ্টি',
            nameEn: 'Rain',
            slug: 'rain',
            description: 'বৃষ্টি ও বর্ষা নিয়ে উক্তি',
            order: 38,
        },
        {
            nameBn: 'রাত',
            nameEn: 'Night',
            slug: 'night',
            description: 'রাত ও নিশি নিয়ে উক্তি',
            order: 39,
        },
        {
            nameBn: 'দেশপ্রেম',
            nameEn: 'Patriotism',
            slug: 'patriotism',
            description: 'দেশপ্রেম ও জাতীয়তাবোধ নিয়ে উক্তি',
            order: 40,
        },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        });
    }

    console.log(`✅ Created ${categories.length} categories`);

    // ============================================================================
    // SEED QUOTES
    // ============================================================================

    console.log('\n💬 Seeding quotes...');

    const inspirationCategory = await prisma.category.findUnique({
        where: { slug: 'inspiration' },
    });

    const loveCategory = await prisma.category.findUnique({
        where: { slug: 'love' },
    });

    const lifeCategory = await prisma.category.findUnique({
        where: { slug: 'life' },
    });

    const quotes = [
        {
            textBn: 'যে ব্যক্তি কখনো ভুল করেনি সে কখনো নতুন কিছু করার চেষ্টা করেনি।',
            textEn: 'A person who never made a mistake never tried anything new.',
            author: 'আলবার্ট আইনস্টাইন',
            categoryId: inspirationCategory!.id,
            status: 'PUBLISHED' as const,
            publishedAt: new Date(),
        },
        {
            textBn: 'সফলতা চূড়ান্ত নয়, ব্যর্থতা মারাত্মক নয়: চালিয়ে যাওয়ার সাহসই গুরুত্বপূর্ণ।',
            textEn: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
            author: 'উইনস্টন চার্চিল',
            categoryId: inspirationCategory!.id,
            status: 'PUBLISHED' as const,
            publishedAt: new Date(),
        },
        {
            textBn: 'ভালোবাসা হল জীবনের সৌন্দর্য, আত্মার সুখ এবং হৃদয়ের আনন্দ।',
            textEn: 'Love is the beauty of life, the happiness of the soul and the joy of the heart.',
            author: 'রবীন্দ্রনাথ ঠাকুর',
            categoryId: loveCategory!.id,
            status: 'PUBLISHED' as const,
            publishedAt: new Date(),
        },
        {
            textBn: 'জীবন হল যা ঘটে যখন তুমি অন্য পরিকল্পনা করতে ব্যস্ত থাকো।',
            textEn: 'Life is what happens when you are busy making other plans.',
            author: 'জন লেনন',
            categoryId: lifeCategory!.id,
            status: 'PUBLISHED' as const,
            publishedAt: new Date(),
        },
        {
            textBn: 'তোমার সময় সীমিত, তাই অন্যের জীবন যাপন করে তা নষ্ট করো না।',
            textEn: 'Your time is limited, so don\'t waste it living someone else\'s life.',
            author: 'স্টিভ জবস',
            categoryId: lifeCategory!.id,
            status: 'PUBLISHED' as const,
            publishedAt: new Date(),
        },
    ];

    for (const quote of quotes) {
        await prisma.quote.create({
            data: quote,
        });
    }

    console.log(`✅ Created ${quotes.length} quotes`);

    // ============================================================================
    // SEED STUDIO ASSETS
    // ============================================================================

    console.log('\n🎨 Seeding studio assets...');

    const gradients = [
        {
            type: 'BACKGROUND_GRADIENT' as const,
            name: 'Sunset',
            value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            isPremium: false,
            order: 1,
        },
        {
            type: 'BACKGROUND_GRADIENT' as const,
            name: 'Ocean',
            value: 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)',
            isPremium: false,
            order: 2,
        },
        {
            type: 'BACKGROUND_GRADIENT' as const,
            name: 'Forest',
            value: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
            isPremium: false,
            order: 3,
        },
    ];

    for (const gradient of gradients) {
        await prisma.studioAsset.create({
            data: gradient,
        });
    }

    console.log(`✅ Created ${gradients.length} gradients`);

    console.log('\n✅ Database seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
