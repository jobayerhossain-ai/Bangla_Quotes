import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => ReactNode;
    className?: string;
}

interface TableProps {
    columns: Column[];
    data: any[];
    onRowClick?: (row: any) => void;
    isLoading?: boolean;
    emptyMessage?: string;
    selectedIds?: string[];
    onSelect?: (ids: string[]) => void;
}

export default function Table({
    columns,
    data,
    onRowClick,
    isLoading,
    emptyMessage = 'No data available',
    selectedIds,
    onSelect,
}: TableProps) {
    const handleSelectAll = (checked: boolean) => {
        if (!onSelect) return;
        if (checked) {
            onSelect(data.map((row) => row.id));
        } else {
            onSelect([]);
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        if (!onSelect || !selectedIds) return;
        if (checked) {
            onSelect([...selectedIds, id]);
        } else {
            onSelect(selectedIds.filter((selectedId) => selectedId !== id));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {onSelect && (
                            <th className="px-6 py-3 w-4">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    checked={data.length > 0 && selectedIds?.length === data.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            </th>
                        )}
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={cn(
                                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                                    column.className
                                )}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, index) => (
                        <tr
                            key={row.id || index}
                            onClick={() => onRowClick?.(row)}
                            className={cn(
                                onRowClick && 'cursor-pointer hover:bg-gray-50 transition-colors',
                                selectedIds?.includes(row.id) && 'bg-primary-50'
                            )}
                        >
                            {onSelect && (
                                <td className="px-6 py-4 w-4" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        checked={selectedIds?.includes(row.id)}
                                        onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                                    />
                                </td>
                            )}
                            {columns.map((column) => (
                                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
