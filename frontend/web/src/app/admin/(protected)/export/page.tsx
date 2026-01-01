'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Download, FileJson, FileSpreadsheet, Database } from 'lucide-react';

export default function ExportPage() {
    const [isExporting, setIsExporting] = useState(false);
    const [exportType, setExportType] = useState<'quotes' | 'categories' | 'users' | 'all'>('quotes');

    const handleExport = async (format: 'csv' | 'json') => {
        setIsExporting(true);

        try {
            // Simulate export - Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const filename = `${exportType}-export-${new Date().toISOString().split('T')[0]}.${format}`;
            alert(`Export completed: ${filename}`);
        } catch (error) {
            alert('Export failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Export Data</h1>
                <p className="text-gray-600 mt-2">Download platform data for backup or analysis</p>
            </div>

            <Card title="Select Data Type">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { id: 'quotes', label: 'Quotes', icon: FileJson },
                        { id: 'categories', label: 'Categories', icon: FileSpreadsheet },
                        { id: 'users', label: 'Users', icon: Database },
                        { id: 'all', label: 'All Data', icon: Database },
                    ].map((type) => {
                        const Icon = type.icon;
                        return (
                            <button
                                key={type.id}
                                onClick={() => setExportType(type.id as any)}
                                className={`p-4 rounded-xl border-2 transition-all ${exportType === type.id
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Icon className={`w-8 h-8 mx-auto mb-2 ${exportType === type.id ? 'text-primary-600' : 'text-gray-400'
                                    }`} />
                                <p className={`text-sm font-medium ${exportType === type.id ? 'text-primary-700' : 'text-gray-600'
                                    }`}>
                                    {type.label}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </Card>

            <Card title="Export Format">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition-all">
                            <FileSpreadsheet className="w-12 h-12 text-green-600 mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">CSV Format</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Compatible with Excel, Google Sheets, and most data tools
                            </p>
                            <Button
                                onClick={() => handleExport('csv')}
                                isLoading={isExporting}
                                className="w-full"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export as CSV
                            </Button>
                        </div>

                        <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-primary-300 transition-all">
                            <FileJson className="w-12 h-12 text-blue-600 mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">JSON Format</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Structured data format for developers and APIs
                            </p>
                            <Button
                                onClick={() => handleExport('json')}
                                isLoading={isExporting}
                                className="w-full"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export as JSON
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="📋 Export Details">
                <div className="space-y-2 text-sm text-gray-600">
                    <p>• <strong>Quotes:</strong> Includes text, author, category, status, and metrics</p>
                    <p>• <strong>Categories:</strong> Includes names, slugs, SEO data, and quote counts</p>
                    <p>• <strong>Users:</strong> Includes basic info, roles, and activity counts (no passwords)</p>
                    <p>• <strong>All Data:</strong> Complete platform backup in structured format</p>
                    <p className="text-xs text-gray-500 mt-4">
                        Note: Exports may take a few moments for large datasets
                    </p>
                </div>
            </Card>
        </div>
    );
}
