# ⚙️ Settings & Final Polish - Complete Implementation

## Overview
Settings page and final touches to complete the Admin Panel.

---

## ⚙️ Settings Page

### `src/app/(dashboard)/settings/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth';
import { authApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User, Lock, Bell, Palette } from 'lucide-react';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword);
      alert('Password changed successfully!');
      reset();
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings</p>
      </div>

      {/* Profile Information */}
      <Card title="Profile Information" subtitle="Your account details">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Role: <span className="font-medium text-primary-600">{user?.role}</span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card title="Change Password" subtitle="Update your password">
        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-6">
          <Input
            label="Current Password"
            type="password"
            {...register('currentPassword')}
            error={errors.currentPassword?.message}
            placeholder="Enter current password"
          />

          <Input
            label="New Password"
            type="password"
            {...register('newPassword')}
            error={errors.newPassword?.message}
            placeholder="Enter new password"
            helperText="Must be at least 8 characters"
          />

          <Input
            label="Confirm New Password"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            placeholder="Confirm new password"
          />

          <div className="flex items-center justify-end">
            <Button type="submit" isLoading={isChangingPassword}>
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Application Info */}
      <Card title="Application Information">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="text-gray-700">Version</span>
            <span className="font-medium text-gray-900">1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="text-gray-700">Environment</span>
            <span className="font-medium text-gray-900">
              {process.env.NODE_ENV || 'development'}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-700">API URL</span>
            <span className="font-medium text-gray-900 text-sm">
              {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}
            </span>
          </div>
        </div>
      </Card>

      {/* Preferences (Future) */}
      <Card title="Preferences" subtitle="Coming soon">
        <div className="space-y-4 opacity-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Email Notifications</span>
            </div>
            <input
              type="checkbox"
              disabled
              className="w-4 h-4 text-primary-600 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Dark Mode</span>
            </div>
            <input
              type="checkbox"
              disabled
              className="w-4 h-4 text-primary-600 border-gray-300 rounded"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
```

---

## 🔧 Missing API Method

### Update `src/lib/api.ts`

Add this method to the `authApi` object:

```typescript
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  me: () => api.get('/auth/me'),
  
  logout: () => api.post('/auth/logout'),
  
  // Add this new method
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword, confirmPassword: newPassword }),
};
```

---

## 📱 Loading Component

### `src/components/ui/Loading.tsx`

```typescript
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto" />
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
```

---

## 🎨 Empty State Component

### `src/components/ui/EmptyState.tsx`

```typescript
import { ReactNode } from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        {icon || <FileQuestion className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
```

---

## 🔔 Toast Notification Component

### `src/components/ui/Toast.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'info',
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-bottom-5',
        styles[type]
      )}
    >
      {icons[type]}
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
```

---

## 📊 Stats Card Component

### `src/components/dashboard/StatsCard.tsx`

```typescript
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import { formatNumber } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
  trend,
}: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatNumber(value)}
          </p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </Card>
  );
}
```

---

## 🎯 README for Admin Panel

### `apps/admin/README.md`

```markdown
# 🎨 Bangla Quotes - Admin Panel

Professional admin panel for managing the Bangla Quotes platform.

## 🚀 Features

### ✅ Implemented
- **Authentication** - Secure login with JWT
- **Dashboard** - Stats, trending quotes, categories overview
- **Quote Management** - CRUD operations, bulk upload, filters
- **Category Management** - CRUD operations, auto slug generation
- **Settings** - Profile, password change

### 🎨 UI Components
- Button, Card, Input, Badge, Table
- Loading states, Empty states, Toast notifications
- Responsive design, Beautiful gradients

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts

## 🛠️ Setup

### Prerequisites
- Node.js >= 20.0.0
- Backend API running on http://localhost:5000

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Start development server
npm run dev
```

Admin panel will run at: **http://localhost:3001**

## 🔐 Default Credentials

- **Email**: admin@banglaquotes.com
- **Password**: Admin@123456

⚠️ **Change these in production!**

## 📁 Project Structure

```
src/
├── app/
│   ├── (dashboard)/        # Protected routes
│   │   ├── page.tsx        # Dashboard
│   │   ├── quotes/         # Quote management
│   │   ├── categories/     # Category management
│   │   └── settings/       # Settings
│   ├── login/              # Login page
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components
│   └── dashboard/          # Dashboard components
├── lib/
│   ├── api.ts             # API client
│   ├── auth.ts            # Auth context
│   ├── utils.ts           # Utilities
│   └── constants.ts       # Constants
└── hooks/                 # Custom hooks
```

## 🎯 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## 📊 Features Overview

### Dashboard
- Total quotes, categories, views, trending stats
- Trending quotes list
- Categories grid
- Quick actions

### Quote Management
- List with filters (status, category, search)
- Pagination
- Create/Edit forms with validation
- Bulk upload via CSV
- Delete with confirmation
- Preview before save

### Category Management
- List with quote counts
- Create/Edit forms
- Auto slug generation from Bangla text
- Delete protection (prevents deletion if has quotes)
- Active/Inactive status

### Settings
- Profile information
- Change password
- Application info

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Secondary**: Purple (#d946ef)
- **Success**: Green (#10b981)
- **Danger**: Red (#ef4444)

### Typography
- **English**: Inter
- **Bangla**: Hind Siliguri

### Components
- Consistent spacing (4px grid)
- Rounded corners (0.5rem)
- Shadow system
- Focus rings

## 🔒 Security

- JWT authentication
- Protected routes
- Token refresh
- Auto-logout on 401
- CSRF protection
- XSS prevention

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Touch-friendly UI
- Optimized for all devices

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build
docker build -t bangla-quotes-admin .

# Run
docker run -p 3001:3001 bangla-quotes-admin
```

## 📝 License

MIT License
```

---

## ✅ Final Checklist

### Core Features
- [x] Authentication system
- [x] Protected routes
- [x] Dashboard with stats
- [x] Quote CRUD operations
- [x] Category CRUD operations
- [x] Bulk upload
- [x] Settings page
- [x] Password change

### UI Components
- [x] Button
- [x] Card
- [x] Input
- [x] Badge
- [x] Table
- [x] Loading
- [x] Empty State
- [x] Toast

### Layout
- [x] Sidebar navigation
- [x] Header with breadcrumbs
- [x] Responsive design
- [x] Beautiful gradients

### Polish
- [x] Error handling
- [x] Loading states
- [x] Empty states
- [x] Form validation
- [x] Confirmation dialogs
- [x] Success messages

---

## 🎉 Admin Panel Complete!

**Status: 100% Complete** ✅

All features implemented and ready for use!

**Next: Phase 5 - Public Web App** 🚀
