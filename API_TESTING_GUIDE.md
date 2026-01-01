# 🧪 API Testing Guide

Complete guide for testing the Bangla Quotes API using Postman, Thunder Client, or cURL.

---

## 📋 Prerequisites

1. **Server Running**: `cd apps/api && npm run dev`
2. **Database Seeded**: `npm run prisma:seed`
3. **Base URL**: `http://localhost:5000`

---

## 🔐 Authentication

### Step 1: Login as Admin

**Endpoint**: `POST /api/v1/auth/login`

**Request**:
```json
{
  "email": "admin@banglaquotes.com",
  "password": "Admin@123456"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "admin@banglaquotes.com",
      "name": "Admin",
      "role": "SUPER_ADMIN"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Save the `accessToken`** - You'll need it for admin endpoints!

---

## 📚 Quote Endpoints

### 1. Get All Quotes (Public)

**GET** `/api/v1/quotes`

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `status` (DRAFT | PUBLISHED | ARCHIVED)
- `categorySlug` (string)
- `search` (string)
- `sortBy` (createdAt | views | shares | downloads)
- `sortOrder` (asc | desc)

**Examples**:
```bash
# Basic
GET /api/v1/quotes

# With pagination
GET /api/v1/quotes?page=1&limit=10

# Published only
GET /api/v1/quotes?status=PUBLISHED

# By category
GET /api/v1/quotes?categorySlug=inspiration

# Search
GET /api/v1/quotes?search=জীবন

# Sort by views
GET /api/v1/quotes?sortBy=views&sortOrder=desc

# Combined
GET /api/v1/quotes?page=1&limit=5&status=PUBLISHED&categorySlug=life&sortBy=views&sortOrder=desc
```

### 2. Get Quote by ID (Public)

**GET** `/api/v1/quotes/:id`

**Example**:
```bash
GET /api/v1/quotes/clrxyz123456789
```

### 3. Get Random Quote (Public)

**GET** `/api/v1/quotes/random`

**Query Parameters**:
- `categorySlug` (optional)

**Examples**:
```bash
# Any category
GET /api/v1/quotes/random

# Specific category
GET /api/v1/quotes/random?categorySlug=love
```

### 4. Get Trending Quotes (Public)

**GET** `/api/v1/quotes/trending`

**Query Parameters**:
- `limit` (number, default: 10)

**Example**:
```bash
GET /api/v1/quotes/trending?limit=5
```

### 5. Create Quote (Admin)

**POST** `/api/v1/quotes`

**Headers**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "textBn": "জীবনে সফল হতে হলে কঠোর পরিশ্রম করতে হবে।",
  "textEn": "To succeed in life, you must work hard.",
  "author": "Unknown",
  "categoryId": "clrxyz123456789",
  "status": "PUBLISHED"
}
```

**Validation Rules**:
- `textBn`: Required, 10-1000 characters
- `textEn`: Optional, 10-1000 characters
- `author`: Optional, 2-100 characters
- `categoryId`: Required, valid CUID
- `status`: Optional, default: DRAFT

### 6. Update Quote (Admin)

**PUT** `/api/v1/quotes/:id`

**Headers**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body** (all fields optional):
```json
{
  "textBn": "Updated Bangla text",
  "textEn": "Updated English text",
  "author": "New Author",
  "categoryId": "new_category_id",
  "status": "PUBLISHED"
}
```

### 7. Delete Quote (Admin)

**DELETE** `/api/v1/quotes/:id`

**Headers**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 8. Bulk Create Quotes (Admin)

**POST** `/api/v1/quotes/bulk`

**Headers**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "quotes": [
    {
      "textBn": "প্রথম উক্তি",
      "textEn": "First quote",
      "author": "Author 1",
      "categoryId": "clrxyz123456789",
      "status": "PUBLISHED"
    },
    {
      "textBn": "দ্বিতীয় উক্তি",
      "textEn": "Second quote",
      "author": "Author 2",
      "categoryId": "clrxyz123456789",
      "status": "DRAFT"
    }
  ]
}
```

**Limits**: 1-100 quotes per request

### 9. Increment View Count (Public)

**POST** `/api/v1/quotes/:id/view`

**Example**:
```bash
POST /api/v1/quotes/clrxyz123456789/view
```

### 10. Increment Share Count (Public)

**POST** `/api/v1/quotes/:id/share`

### 11. Increment Download Count (Public)

**POST** `/api/v1/quotes/:id/download`

---

## 📂 Category Endpoints

### 1. Get All Categories (Public)

**GET** `/api/v1/categories`

**Query Parameters**:
- `page` (number, optional)
- `limit` (number, optional)
- `isActive` (boolean)
- `sortBy` (order | nameBn | nameEn | createdAt)
- `sortOrder` (asc | desc)

**Examples**:
```bash
# All categories
GET /api/v1/categories

# Active only
GET /api/v1/categories?isActive=true

# With pagination
GET /api/v1/categories?page=1&limit=10

# Sorted by name
GET /api/v1/categories?sortBy=nameBn&sortOrder=asc
```

### 2. Get Category by ID (Public)

**GET** `/api/v1/categories/id/:id`

**Example**:
```bash
GET /api/v1/categories/id/clrxyz123456789
```

### 3. Get Category by Slug (Public)

**GET** `/api/v1/categories/:slug`

**Example**:
```bash
GET /api/v1/categories/inspiration
```

### 4. Get Popular Categories (Public)

**GET** `/api/v1/categories/popular`

**Query Parameters**:
- `limit` (number, default: 10)

**Example**:
```bash
GET /api/v1/categories/popular?limit=5
```

### 5. Get Category Quotes (Public)

**GET** `/api/v1/categories/:slug/quotes`

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `sortBy` (createdAt | views | shares | downloads)
- `sortOrder` (asc | desc)

**Example**:
```bash
GET /api/v1/categories/inspiration/quotes?page=1&limit=10&sortBy=views&sortOrder=desc
```

### 6. Create Category (Admin)

**POST** `/api/v1/categories`

**Headers**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "nameBn": "প্রেরণা",
  "nameEn": "Motivation",
  "slug": "motivation",
  "description": "প্রেরণামূলক উক্তি",
  "isActive": true,
  "order": 1
}
```

**Validation Rules**:
- `nameBn`: Required, 2-100 characters
- `nameEn`: Required, 2-100 characters
- `slug`: Optional (auto-generated from nameBn), lowercase with hyphens
- `description`: Optional, max 500 characters
- `isActive`: Optional, default: true
- `order`: Optional, default: 0

**Slug Auto-Generation**:
If you don't provide a slug, it will be auto-generated:
- `অনুপ্রেরণা` → `onuprerana`
- `ভালোবাসা` → `bhalobasa`
- `জীবন` → `jibon`

### 7. Update Category (Admin)

**PUT** `/api/v1/categories/:id`

**Headers**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body** (all fields optional):
```json
{
  "nameBn": "Updated Bangla name",
  "nameEn": "Updated English name",
  "slug": "new-slug",
  "description": "Updated description",
  "isActive": false,
  "order": 5
}
```

### 8. Delete Category (Admin)

**DELETE** `/api/v1/categories/:id`

**Headers**:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Note**: Cannot delete category with quotes. Will return error with quote count.

---

## 🧪 Postman Collection

### Import this JSON into Postman:

```json
{
  "info": {
    "name": "Bangla Quotes API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api/v1"
    },
    {
      "key": "accessToken",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@banglaquotes.com\",\n  \"password\": \"Admin@123456\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Quotes",
      "item": [
        {
          "name": "Get All Quotes",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/quotes?page=1&limit=10",
              "host": ["{{baseUrl}}"],
              "path": ["quotes"],
              "query": [
                {"key": "page", "value": "1"},
                {"key": "limit", "value": "10"}
              ]
            }
          }
        },
        {
          "name": "Create Quote",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"textBn\": \"জীবনে সফল হতে হলে কঠোর পরিশ্রম করতে হবে।\",\n  \"textEn\": \"To succeed in life, you must work hard.\",\n  \"author\": \"Unknown\",\n  \"categoryId\": \"YOUR_CATEGORY_ID\",\n  \"status\": \"PUBLISHED\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/quotes",
              "host": ["{{baseUrl}}"],
              "path": ["quotes"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🔍 Testing Checklist

### Authentication
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should fail)
- [ ] Access protected route without token (should fail)
- [ ] Access protected route with invalid token (should fail)
- [ ] Refresh access token

### Quotes
- [ ] Get all quotes
- [ ] Get quotes with pagination
- [ ] Get quotes with filters (status, category, search)
- [ ] Get quotes with sorting
- [ ] Get single quote by ID
- [ ] Get random quote
- [ ] Get trending quotes
- [ ] Create quote (admin)
- [ ] Update quote (admin)
- [ ] Delete quote (admin)
- [ ] Bulk create quotes (admin)
- [ ] Increment view count
- [ ] Increment share count
- [ ] Increment download count

### Categories
- [ ] Get all categories
- [ ] Get categories with filters
- [ ] Get category by ID
- [ ] Get category by slug
- [ ] Get popular categories
- [ ] Get category quotes
- [ ] Create category (admin)
- [ ] Create category with auto slug
- [ ] Update category (admin)
- [ ] Delete category (admin)
- [ ] Try to delete category with quotes (should fail)

### Validation
- [ ] Create quote with missing required fields (should fail)
- [ ] Create quote with invalid category ID (should fail)
- [ ] Create category with invalid slug format (should fail)
- [ ] Update with invalid data (should fail)

### Rate Limiting
- [ ] Make 200+ requests quickly (should get rate limited)

---

## 📊 Expected Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-12-31T11:08:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2025-12-31T11:08:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "textBn",
        "message": "Bangla text is required"
      }
    ]
  },
  "timestamp": "2025-12-31T11:08:00.000Z"
}
```

---

## 🎯 Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 422 | Input validation failed |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Not authorized (wrong role) |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Duplicate resource (e.g., slug exists) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

---

**Happy Testing! 🚀**
