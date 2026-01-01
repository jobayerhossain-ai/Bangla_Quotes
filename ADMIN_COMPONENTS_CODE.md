# 🎨 Admin Panel - Complete Implementation Code

## Overview
This document contains all the code needed to complete the Admin Panel. Copy and paste these files to finish the implementation.

---

## 📁 UI Components

### Card.tsx (`src/components/ui/Card.tsx`)

```typescript
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export default function Card({
  title,
  subtitle,
  children,
  footer,
  className,
  headerAction,
}: CardProps) {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
}
```

### Input.tsx (`src/components/ui/Input.tsx`)

```typescript
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2 border rounded-lg transition-all',
            'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error ? 'border-red-500' : 'border-gray-300',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
```

### Badge.tsx (`src/components/ui/Badge.tsx`)

```typescript
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  children: ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
```

### Table.tsx (`src/components/ui/Table.tsx`)

```typescript
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
}

export default function Table({
  columns,
  data,
  onRowClick,
  isLoading,
  emptyMessage = 'No data available',
}: TableProps) {
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
              key={index}
              onClick={() => onRowClick?.(row)}
              className={cn(
                onRowClick && 'cursor-pointer hover:bg-gray-50 transition-colors'
              )}
            >
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
```

---

## 📁 Layout Components

### Sidebar.tsx (`src/components/layout/Sidebar.tsx`)

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Quote, 
  FolderOpen, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

const menuItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Quotes', href: '/quotes', icon: Quote },
  { label: 'Categories', href: '/categories', icon: FolderOpen },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
          Bangla Quotes
        </h1>
        <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
```

### Header.tsx (`src/components/layout/Header.tsx`)

```typescript
'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      href: '/' + paths.slice(0, index + 1).join('/'),
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="text-gray-900 font-medium">Home</span>
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>
              {crumb.label}
            </span>
          </div>
        ))}
      </div>
    </header>
  );
}
```

### Dashboard Layout (`src/app/(dashboard)/layout.tsx`)

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 📊 Dashboard Page

### Dashboard Page (`src/app/(dashboard)/page.tsx`)

```typescript
'use client';

import { useQuotes, useTrendingQuotes } from '@/hooks/useQuotes';
import { useCategories } from '@/hooks/useCategories';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatNumber, formatDate } from '@/lib/utils';
import { TrendingUp, Quote, FolderOpen, Eye } from 'lucide-react';

export default function DashboardPage() {
  const { quotes } = useQuotes({ status: 'PUBLISHED' });
  const { categories } = useCategories({ isActive: true });
  const { quotes: trending } = useTrendingQuotes(5);

  const stats = [
    {
      label: 'Total Quotes',
      value: quotes?.length || 0,
      icon: Quote,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Categories',
      value: categories?.length || 0,
      icon: FolderOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total Views',
      value: quotes?.reduce((sum: number, q: any) => sum + (q.views || 0), 0) || 0,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Trending',
      value: trending?.length || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Bangla Quotes Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatNumber(stat.value)}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Trending Quotes */}
      <Card title="Trending Quotes" subtitle="Most viewed quotes">
        <div className="space-y-4">
          {trending?.map((quote: any) => (
            <div
              key={quote.id}
              className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <p className="font-bangla text-lg text-gray-900">{quote.textBn}</p>
                {quote.author && (
                  <p className="text-sm text-gray-600 mt-1">— {quote.author}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500">
                    {formatNumber(quote.views)} views
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatNumber(quote.shares)} shares
                  </span>
                </div>
              </div>
              <Badge variant="success">{quote.category.nameEn}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Categories */}
      <Card title="Categories" subtitle="All active categories">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories?.slice(0, 8).map((category: any) => (
            <div
              key={category.id}
              className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg hover:shadow-md transition-shadow"
            >
              <p className="font-bangla font-semibold text-gray-900">{category.nameBn}</p>
              <p className="text-sm text-gray-600 mt-1">{category.nameEn}</p>
              <p className="text-xs text-gray-500 mt-2">
                {category._count?.quotes || 0} quotes
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
```

---

## 📝 Next Steps

1. **Copy all code above** into respective files
2. **Create remaining directories**:
   ```bash
   mkdir src\app\(dashboard)
   mkdir src\app\(dashboard)\quotes
   mkdir src\app\(dashboard)\categories
   mkdir src\components\layout
   ```

3. **Install dependencies** (if not done):
   ```bash
   cd apps/admin
   npm install
   ```

4. **Start dev server**:
   ```bash
   npm run dev
   ```

5. **Test the dashboard**:
   - Login at http://localhost:3001/login
   - View dashboard at http://localhost:3001/

---

## 🎯 Status

**Completed:**
- ✅ Button component
- ✅ All UI components (code provided)
- ✅ Layout components (code provided)
- ✅ Dashboard page (code provided)

**Next:**
- ⏳ Quote management pages
- ⏳ Category management pages

Would you like me to continue with Quote Management pages? 🚀
