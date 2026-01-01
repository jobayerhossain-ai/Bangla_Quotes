'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl font-bangla">বা</span>
                        </div>
                        <span className="text-xl font-bold text-gradient">Bangla Quotes</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/quotes" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                            Quotes
                        </Link>
                        <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                            Categories
                        </Link>
                        <Link href="/studio" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
                            Studio
                        </Link>
                        {/* 
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              About
            </Link>
            */}
                        <Link
                            href="/search"
                            className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-700"
                        aria-label="Menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden py-4 space-y-2 border-t border-gray-100">
                        <Link
                            href="/quotes"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Quotes
                        </Link>
                        <Link
                            href="/categories"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Categories
                        </Link>
                        <Link
                            href="/studio"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Studio
                        </Link>
                        <Link
                            href="/search"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Search
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
