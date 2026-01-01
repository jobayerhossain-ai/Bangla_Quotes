/**
 * Slug Utilities
 * 
 * Functions for generating URL-friendly slugs from Bangla text.
 */

/**
 * Bangla to English transliteration map
 */
const banglaToEnglishMap: Record<string, string> = {
    'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u', 'ঋ': 'ri',
    'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
    'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
    'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
    'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
    'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
    'প': 'p', 'ফ': 'ph', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
    'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's', 'হ': 'h',
    'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y',
    'ৎ': 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': '',
    'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ৃ': 'ri',
    'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
    '্': '', // Halant (vowel killer)
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
};

/**
 * Generate slug from Bangla text
 */
export const generateSlug = (text: string): string => {
    // Convert to lowercase
    let slug = text.toLowerCase();

    // Transliterate Bangla to English
    slug = slug
        .split('')
        .map((char) => banglaToEnglishMap[char] || char)
        .join('');

    // Remove special characters and replace spaces with hyphens
    slug = slug
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
        .replace(/^-+/, '')        // Remove leading hyphens
        .replace(/-+$/, '');       // Remove trailing hyphens

    return slug;
};

/**
 * Generate unique slug by appending number if needed
 */
export const generateUniqueSlug = async (
    text: string,
    checkExists: (slug: string) => Promise<boolean>
): Promise<string> => {
    let slug = generateSlug(text);
    let counter = 1;
    let uniqueSlug = slug;

    while (await checkExists(uniqueSlug)) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
};

/**
 * Validate slug format
 */
export const isValidSlug = (slug: string): boolean => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
};
