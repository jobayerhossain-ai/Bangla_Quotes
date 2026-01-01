import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-100 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg font-bangla">বা</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">Bangla Quotes</span>
                    </div>

                    <div className="text-sm text-gray-500">
                        © {currentYear} Bangla Quotes. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
