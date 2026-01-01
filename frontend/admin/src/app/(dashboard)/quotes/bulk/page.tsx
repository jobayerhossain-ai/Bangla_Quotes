'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Upload, Download, FileText, AlertCircle } from 'lucide-react';

export default function BulkUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [results, setResults] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResults(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Simulate upload - Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            setResults({
                success: 45,
                failed: 5,
                total: 50,
                errors: [
                    'Row 12: Missing category',
                    'Row 23: Invalid author name',
                    'Row 34: Duplicate quote',
                    'Row 41: Text too short',
                    'Row 48: Missing required field',
                ]
            });

            alert('Upload completed! Check results below.');
        } catch (error) {
            alert('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const downloadTemplate = () => {
        const csvContent = `textBn,textEn,author,categoryId,status
"জীবন একটি সুন্দর যাত্রা","Life is a beautiful journey","রবীন্দ্রনাথ ঠাকুর","category-id-here","PUBLISHED"
"স্বপ্ন দেখো এবং বিশ্বাস করো","Dream and believe","কাজী নজরুল ইসলাম","category-id-here","DRAFT"`;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes-template.csv';
        a.click();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Bulk Upload</h1>
                <p className="text-gray-600 mt-2">Import multiple quotes from CSV or JSON file</p>
            </div>

            <Card title="📥 Upload Instructions">
                <div className="space-y-3 text-sm text-gray-600">
                    <p>• Download the template file to see the required format</p>
                    <p>• Fill in your quotes data (textBn, textEn, author, categoryId, status)</p>
                    <p>• Upload the completed file (CSV or JSON)</p>
                    <p>• Review the results and fix any errors</p>
                </div>
            </Card>

            <Card title="Step 1: Download Template">
                <div className="flex gap-3">
                    <Button variant="outline" onClick={downloadTemplate}>
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV Template
                    </Button>
                    <Button variant="outline" onClick={() => alert('JSON template coming soon')}>
                        <Download className="w-4 h-4 mr-2" />
                        Download JSON Template
                    </Button>
                </div>
            </Card>

            <Card title="Step 2: Upload File">
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                        <input
                            type="file"
                            accept=".csv,.json"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">
                                {file ? file.name : 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-xs text-gray-500">CSV or JSON (Max 10MB)</p>
                        </label>
                    </div>

                    {file && (
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-gray-900">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <Button onClick={handleUpload} isLoading={isUploading}>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {results && (
                <Card title="Upload Results">
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-green-50 rounded-lg text-center">
                                <p className="text-3xl font-bold text-green-600">{results.success}</p>
                                <p className="text-sm text-gray-600">Successful</p>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg text-center">
                                <p className="text-3xl font-bold text-red-600">{results.failed}</p>
                                <p className="text-sm text-gray-600">Failed</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg text-center">
                                <p className="text-3xl font-bold text-blue-600">{results.total}</p>
                                <p className="text-sm text-gray-600">Total</p>
                            </div>
                        </div>

                        {results.errors.length > 0 && (
                            <div className="p-4 bg-red-50 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-red-900 mb-2">Errors Found:</h4>
                                        <ul className="space-y-1 text-sm text-red-700">
                                            {results.errors.map((error: string, i: number) => (
                                                <li key={i}>• {error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
