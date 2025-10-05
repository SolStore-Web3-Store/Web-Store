# SolStore API Documentation

## Overview

SolStore is a Web3 ecommerce platform for creators and developers to create, manage and sell digital products powered by blockchain technology. This documentation describes the implemented API endpoints.

## Current Status

✅ **Implemented**: Backend API with Node.js/Express, Prisma ORM, PostgreSQL database, JWT authentication, and UploadThing file storage.

## Base URL

```
http://localhost:4000/v1
```

For production:

```
https://your-domain.com/v1
```

## Authentication

All API requests require authentication using JWT tokens or Solana wallet signatures.

```http
Authorization: Bearer <jwt_token>
```

Or for Solana wallet authentication:

```http
X-Wallet-Address: <solana_wallet_address>
X-Wallet-Signature: <signed_message>
```

## Routes Structure

### Frontend Routes

| Route                   | Component                           | Description                                      |
| ----------------------- | ----------------------------------- | ------------------------------------------------ |
| `/`                     | `app/page.tsx`                      | Landing page with features and marketing content |
| `/onboard`              | `app/onboard/page.tsx`              | Store creation wizard (5 steps)                  |
| `/admin`                | `app/admin/page.tsx`                | Admin dashboard showing all user stores          |
| `/admin/store`          | `app/admin/store/page.tsx`          | Individual store dashboard                       |
| `/admin/store/products` | `app/admin/store/products/page.tsx` | Product management                               |
| `/admin/store/orders`   | `app/admin/store/orders/page.tsx`   | Order management                                 |
| `/admin/store/settings` | `app/admin/store/settings/page.tsx` | Store settings                                   |
| `/[storeSlug]`          | `app/[storeSlug]/page.tsx`          | Public store front                               |

## API Endpoints

### 1. Authentication & Wallet

#### Connect Wallet

```http
POST /v1/auth/wallet/connect
```

**Request Body:**

```json
{
  "walletAddress": "string (32-44 chars)",
  "signature": "string (min 64 chars)",
  "message": "string"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "walletAddress": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      "email": null,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_SIGNATURE",
    "message": "Invalid wallet signature"
  }
}
```

#### Verify Token

```http
GET /v1/auth/verify
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": "uuid",
      "walletAddress": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
    }
  }
}
```

### 2. Store Management

#### Create Store

```http
POST /v1/stores
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "storeName": "string (1-255 chars)",
  "storeSlug": "string (1-100 chars, lowercase, numbers, hyphens only)",
  "storeIcon": "string (optional, UploadThing URL)",
  "storeBanner": "string (optional, UploadThing URL)",
  "description": "string (optional, max 1000 chars)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Awesome Store",
    "slug": "my-awesome-store",
    "description": "This is my store description",
    "icon": "https://utfs.io/f/file-key-here",
    "banner": "https://utfs.io/f/banner-key-here",
    "ownerId": "uuid",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "STORE_SLUG_TAKEN",
    "message": "Store slug already exists"
  }
}
```

#### Get User Stores

```http
GET /v1/stores
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "CryptoArt Gallery",
      "slug": "cryptoart-gallery",
      "description": "Digital art and NFT marketplace for creators",
      "revenue": "12.5",
      "orders": 47,
      "products": 23,
      "status": "active",
      "icon": "🎨",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Store by Slug (Public)

```http
GET /v1/stores/{storeSlug}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "CryptoArt Gallery",
    "slug": "cryptoart-gallery",
    "description": "Digital art and NFT marketplace",
    "icon": "https://utfs.io/f/icon-key",
    "banner": "https://utfs.io/f/banner-key",
    "settings": {
      "currency": "SOL",
      "language": "English",
      "timezone": "UTC",
      "theme": "light"
    },
    "owner": {
      "walletAddress": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
    }
  }
}
```

#### Update Store

```http
PUT /v1/stores/{storeId}
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "iconUrl": "string (optional, UploadThing URL)",
  "bannerUrl": "string (optional, UploadThing URL)",
  "settings": {
    "currency": "SOL|USDC",
    "language": "string",
    "timezone": "string",
    "theme": "light|dark",
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    },
    "privacy": {
      "storeVisible": true,
      "requireLogin": false
    }
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Store Name",
    "slug": "my-store",
    "description": "Updated description",
    "icon": "https://utfs.io/f/new-icon-key",
    "banner": "https://utfs.io/f/new-banner-key",
    "settings": { "..." },
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Delete Store

```http
DELETE /v1/stores/{storeId}
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Store deleted successfully"
  }
}
```

### 3. File Upload

#### Upload Store Icon

```http
POST /v1/upload/store-icon
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>
```

**Request Body:**

- `icon`: File (image only, max 4MB)

**Supported formats:** JPEG, PNG, GIF, WebP

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://utfs.io/f/abc123-def456-ghi789",
    "key": "abc123-def456-ghi789",
    "name": "store-icon.png",
    "size": 12345
  }
}
```

#### Upload Store Banner

```http
POST /v1/upload/store-banner
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>
```

**Request Body:**

- `banner`: File (image only, max 8MB)

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://utfs.io/f/xyz789-abc123-def456",
    "key": "xyz789-abc123-def456",
    "name": "store-banner.jpg",
    "size": 67890
  }
}
```

#### Delete File

```http
DELETE /v1/upload/file/{fileKey}
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "File deleted successfully"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "NO_FILE",
    "message": "No file uploaded"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "UPLOAD_FAILED",
    "message": "Failed to upload file to UploadThing"
  }
}
```

### 4. Product Management

#### Create Product

```http
POST /v1/stores/{storeId}/products
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "name": "string (1-255 chars)",
  "description": "string (optional, max 2000 chars)",
  "price": "number (min 0)",
  "currency": "SOL|USDC (default: SOL)",
  "category": "string (optional, max 100 chars)",
  "stock": "number|'unlimited' (optional)",
  "images": ["string"] (optional, array of URLs),
  "status": "active|draft|inactive (default: active)",
  "metadata": {
    "downloadUrl": "string (optional)",
    "fileSize": "string (optional)",
    "fileType": "string (optional)"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Digital Art Collection #1",
    "description": "Exclusive digital art pieces",
    "price": "2.5",
    "currency": "SOL",
    "category": "Digital Art",
    "stock": "unlimited",
    "sales": 0,
    "revenue": "0",
    "status": "active",
    "images": ["https://utfs.io/f/image1", "https://utfs.io/f/image2"],
    "metadata": {
      "downloadUrl": "https://example.com/download",
      "fileSize": "10MB",
      "fileType": "ZIP"
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Store Products

```http
GET /v1/stores/{storeId}/products
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `status`: string (active|draft|inactive)
- `category`: string
- `search`: string (max 255 chars)

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Digital Art Collection #1",
        "description": "Exclusive digital art pieces",
        "price": "2.5",
        "currency": "SOL",
        "sales": 23,
        "revenue": "57.5",
        "status": "active",
        "category": "Digital Art",
        "stock": "unlimited",
        "images": ["https://utfs.io/f/image1"],
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

#### Update Product

```http
PUT /v1/stores/{storeId}/products/{productId}
Authorization: Bearer <jwt_token>
```

**Request Body:** (All fields optional)

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "currency": "SOL|USDC",
  "category": "string",
  "stock": "number|'unlimited'",
  "images": ["string"],
  "status": "active|draft|inactive",
  "metadata": {}
}
```

#### Delete Product

```http
DELETE /v1/stores/{storeId}/products/{productId}
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Product deleted successfully"
  }
}
```

### 5. Order Management

#### Create Order (Public)

```http
POST /v1/stores/{storeId}/orders
```

**Request Body:**

```json
{
  "productId": "string (uuid)",
  "quantity": "number (default: 1, min: 1)",
  "customerEmail": "string (optional, valid email)",
  "customerWallet": "string (32-44 chars)",
  "paymentMethod": "solana"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "#ORD-1234567890",
    "productId": "uuid",
    "totalAmount": "2.5",
    "currency": "SOL",
    "status": "pending",
    "customerWallet": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "customerEmail": "customer@example.com",
    "paymentTxHash": null,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Store Orders

```http
GET /v1/stores/{storeId}/orders
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `status`: string (completed|pending|processing|failed|cancelled)
- `search`: string (max 255 chars)

**Response:**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "orderNumber": "#ORD-1234567890",
        "customer": {
          "wallet": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
          "email": "customer@example.com"
        },
        "product": {
          "id": "uuid",
          "name": "Digital Art Collection #1"
        },
        "quantity": 1,
        "totalAmount": "2.5",
        "currency": "SOL",
        "status": "completed",
        "paymentTxHash": "5KJp7z8abc123def456...",
        "createdAt": "2024-10-01T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

#### Update Order Status

```http
PUT /v1/stores/{storeId}/orders/{orderId}
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "status": "completed|processing|failed|cancelled",
  "paymentTxHash": "string (optional, 64-88 chars)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "#ORD-1234567890",
    "status": "completed",
    "paymentTxHash": "5KJp7z8abc123def456...",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 6. Checkout & Payments (Solana Pay)

#### Create Checkout Session

```http
POST /v1/stores/{storeId}/checkout
```

**Request Body:**

```json
{
  "productId": "string (uuid)",
  "quantity": "number (default: 1, min: 1)",
  "customerWallet": "string (32-44 chars, Solana wallet address)",
  "customerEmail": "string (optional, valid email)",
  "currency": "SOL|USDC (default: SOL)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "#ORD-1234567890",
    "paymentURL": "solana:9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM?amount=2.5&reference=...",
    "qrCode": "solana:9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM?amount=2.5&reference=...",
    "amount": "2.5",
    "currency": "SOL",
    "reference": "reference-public-key-string",
    "expiresAt": "2024-01-01T00:05:00Z",
    "product": {
      "id": "uuid",
      "name": "Digital Art Collection #1",
      "price": "2.5"
    },
    "store": {
      "id": "uuid",
      "name": "CryptoArt Gallery"
    }
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_WALLET",
    "message": "Invalid customer wallet address"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_OUT_OF_STOCK",
    "message": "Insufficient stock available"
  }
}
```

#### Verify Payment

```http
POST /v1/stores/{storeId}/checkout/verify
```

**Request Body:**

```json
{
  "orderId": "string (uuid)",
  "signature": "string (optional, transaction signature)"
}
```

**Response (Payment Confirmed):**

```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "#ORD-1234567890",
    "status": "completed",
    "paymentConfirmed": true,
    "transactionSignature": "5KJp7z8abc123def456...",
    "paidAmount": "2.5",
    "paidAt": "2024-01-01T00:03:45Z"
  }
}
```

**Response (Payment Pending):**

```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "#ORD-1234567890",
    "status": "pending",
    "paymentConfirmed": false,
    "message": "Payment not yet confirmed"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": {
    "code": "ORDER_EXPIRED",
    "message": "Order has expired"
  }
}
```

#### Get Checkout Status

```http
GET /v1/stores/{storeId}/checkout/{orderId}/status
```

**Response:**

```json
{
  "success": true,
  "data": {
    "orderId": "uuid",
    "orderNumber": "#ORD-1234567890",
    "status": "pending|completed|failed",
    "amount": "2.5",
    "currency": "SOL",
    "paymentURL": "solana:9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM?amount=2.5&reference=...",
    "expiresAt": "2024-01-01T00:05:00Z",
    "transactionSignature": "5KJp7z8abc123def456..." | null,
    "items": [
      {
        "product": {
          "id": "uuid",
          "name": "Digital Art Collection #1",
          "price": "2.5"
        },
        "quantity": 1,
        "price": "2.5"
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:03:45Z"
  }
}
```

### 7. Analytics & Dashboard

#### Get Store Analytics

```http
GET /v1/stores/{storeId}/analytics
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `period`: string (7d|30d|90d|1y, default: 30d)

**Response:**

```json
{
  "success": true,
  "data": {
    "revenue": {
      "current": "12.5",
      "previous": "10.8",
      "currency": "SOL",
      "change": "+15.7%"
    },
    "orders": {
      "current": 47,
      "previous": 43,
      "change": "+9.3%"
    },
    "products": {
      "total": 23,
      "active": 20,
      "draft": 2,
      "inactive": 1
    },
    "customers": {
      "current": 156,
      "previous": 135,
      "change": "+15.6%"
    },
    "topProducts": [
      {
        "id": "uuid",
        "name": "Digital Art Collection #1",
        "sales": 23,
        "revenue": "57.5"
      }
    ],
    "recentOrders": [
      {
        "id": "uuid",
        "orderNumber": "#ORD-1234567890",
        "customerWallet": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
        "productName": "Digital Art Collection #1",
        "totalAmount": "2.5",
        "currency": "SOL",
        "status": "completed",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "chartData": [
      {
        "date": "2024-01-01",
        "revenue": "2.5",
        "orders": 3
      }
    ]
  }
}
```

**Note:** This endpoint is implemented in the frontend API client (`lib/api.ts`) as `storeApi.getStoreAnalytics(storeId, period)` and provides comprehensive analytics data for store owners to track their business performance.

## Error Responses

All API endpoints return errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Common Error Codes

- `UNAUTHORIZED`: Invalid or missing authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `WALLET_NOT_CONNECTED`: Solana wallet not connected
- `INSUFFICIENT_FUNDS`: Not enough SOL for transaction
- `STORE_SLUG_TAKEN`: Store slug already exists
- `PRODUCT_OUT_OF_STOCK`: Product not available
- `INVALID_WALLET`: Invalid Solana wallet address
- `ORDER_EXPIRED`: Checkout session has expired
- `INVALID_ORDER`: Order missing required data

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## Implementation Details

### Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **File Storage**: UploadThing (CDN + Storage)
- **Payments**: Solana Pay integration with SOL and USDC support
- **Rate Limiting**: Express rate limiter (100 requests per 15 minutes)
- **Security**: Helmet.js, CORS enabled

### Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# UploadThing
UPLOADTHING_TOKEN="your-uploadthing-token"

# Solana Configuration
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
STORE_WALLET_ADDRESS="your-store-wallet-public-key"

# Server
PORT=4000
NODE_ENV="development"
```

### Quick Start Guide

1. **Clone and Install**

```bash
git clone <repository>
npm install
```

2. **Setup Database**

```bash
npm run db:generate
npm run db:push
npm run db:seed  # Optional: Add sample data
```

3. **Start Development Server**

```bash
npm run dev
```

4. **Test API**

```bash
curl http://localhost:4000/health
```

### Example Usage Flow

1. **Connect Wallet**

```bash
curl -X POST http://localhost:4000/v1/auth/wallet/connect \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "signature": "signature_here_min_64_chars",
    "message": "Sign in to SolStore"
  }'
```

2. **Upload Store Icon**

```bash
curl -X POST http://localhost:4000/v1/upload/store-icon \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "icon=@path/to/icon.png"
```

3. **Create Store**

```bash
curl -X POST http://localhost:4000/v1/stores \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "My Store",
    "storeSlug": "my-store",
    "storeIcon": "https://utfs.io/f/uploaded-icon-key",
    "description": "My awesome store"
  }'
```

4. **Create Checkout Session**

```bash
curl -X POST http://localhost:4000/v1/stores/STORE_ID/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 1,
    "customerWallet": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "customerEmail": "customer@example.com",
    "currency": "SOL"
  }'
```

5. **Verify Payment**

```bash
curl -X POST http://localhost:4000/v1/stores/STORE_ID/checkout/verify \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER_ID_FROM_CHECKOUT"
  }'
```

### Rate Limiting

- **Global**: 100 requests per 15 minutes per IP
- **File Upload**: 8MB max file size
- **Request Body**: 10MB max size

### Security Features

- JWT token authentication
- Input validation with Joi schemas
- SQL injection protection via Prisma
- File type validation for uploads
- CORS enabled for cross-origin requests
- Helmet.js for security headers
