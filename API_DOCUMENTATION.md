# SolStore API Documentation

## Overview

SolStore is a Web3 ecommerce platform for creators and developers to create, manage and sell digital products powered by blockchain technology. This documentation outlines the API structure needed to support the current frontend implementation.

## Current Status

⚠️ **Note**: The current codebase is frontend-only with mock data. This documentation describes the API endpoints that need to be implemented to support the existing UI components.

## Base URL

```
https://api.solstore.com/v1
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

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `app/page.tsx` | Landing page with features and marketing content |
| `/onboard` | `app/onboard/page.tsx` | Store creation wizard (5 steps) |
| `/admin` | `app/admin/page.tsx` | Admin dashboard showing all user stores |
| `/admin/store` | `app/admin/store/page.tsx` | Individual store dashboard |
| `/admin/store/products` | `app/admin/store/products/page.tsx` | Product management |
| `/admin/store/orders` | `app/admin/store/orders/page.tsx` | Order management |
| `/admin/store/settings` | `app/admin/store/settings/page.tsx` | Store settings |
| `/[storeSlug]` | `app/[storeSlug]/page.tsx` | Public store front |

## API Endpoints

### 1. Authentication & Wallet

#### Connect Wallet
```http
POST /auth/wallet/connect
```

**Request Body:**
```json
{
  "walletAddress": "string",
  "signature": "string",
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "string",
      "walletAddress": "string",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### Verify Token
```http
GET /auth/verify
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": "string",
      "walletAddress": "string"
    }
  }
}
```

### 2. Store Management

#### Create Store
```http
POST /stores
```

**Request Body:**
```json
{
  "storeName": "string",
  "storeSlug": "string",
  "storeIcon": "file_upload_or_url",
  "description": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "description": "string",
    "icon": "string",
    "ownerId": "string",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get User Stores
```http
GET /stores
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
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

#### Get Store by Slug
```http
GET /stores/{storeSlug}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "description": "string",
    "icon": "string",
    "banner": "string",
    "settings": {
      "currency": "SOL",
      "language": "English",
      "timezone": "UTC",
      "theme": "light"
    },
    "owner": {
      "walletAddress": "string"
    }
  }
}
```

#### Update Store
```http
PUT /stores/{storeId}
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "settings": {
    "currency": "SOL",
    "language": "English",
    "timezone": "UTC",
    "theme": "light",
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

#### Delete Store
```http
DELETE /stores/{storeId}
```

### 3. Product Management

#### Create Product
```http
POST /stores/{storeId}/products
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "currency": "SOL",
  "category": "string",
  "stock": "number|unlimited",
  "images": ["string"],
  "status": "active|draft|inactive",
  "metadata": {
    "downloadUrl": "string",
    "fileSize": "string",
    "fileType": "string"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "2.5",
    "currency": "SOL",
    "category": "Digital Art",
    "stock": "unlimited",
    "sales": 0,
    "revenue": "0",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Store Products
```http
GET /stores/{storeId}/products
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `status`: string (active|draft|inactive)
- `category`: string
- `search`: string

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "string",
        "name": "Digital Art Collection #1",
        "description": "Exclusive digital art pieces",
        "price": "2.5",
        "currency": "SOL",
        "sales": 23,
        "revenue": "57.5",
        "status": "active",
        "category": "Digital Art",
        "stock": "unlimited",
        "images": ["string"]
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
PUT /stores/{storeId}/products/{productId}
```

#### Delete Product
```http
DELETE /stores/{storeId}/products/{productId}
```

### 4. Order Management

#### Create Order
```http
POST /stores/{storeId}/orders
```

**Request Body:**
```json
{
  "productId": "string",
  "quantity": 1,
  "customerEmail": "string",
  "customerWallet": "string",
  "paymentMethod": "solana"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "orderId": "#ORD-001",
    "productId": "string",
    "customerId": "string",
    "amount": "2.5",
    "currency": "SOL",
    "status": "pending",
    "paymentTxHash": null,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Get Store Orders
```http
GET /stores/{storeId}/orders
```

**Query Parameters:**
- `page`: number
- `limit`: number
- `status`: string (completed|pending|processing|failed)
- `search`: string

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "string",
        "orderId": "#ORD-001",
        "customer": {
          "wallet": "alice.sol",
          "email": "alice@example.com"
        },
        "product": {
          "id": "string",
          "name": "Digital Art Collection #1"
        },
        "amount": "2.5",
        "currency": "SOL",
        "status": "completed",
        "paymentTxHash": "5KJp7z8...",
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
PUT /stores/{storeId}/orders/{orderId}
```

**Request Body:**
```json
{
  "status": "completed|processing|failed",
  "paymentTxHash": "string"
}
```

### 5. Analytics & Dashboard

#### Get Store Analytics
```http
GET /stores/{storeId}/analytics
```

**Query Parameters:**
- `period`: string (7d|30d|90d|1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": "12.5",
      "currency": "SOL",
      "change": "+12.5%"
    },
    "orders": {
      "total": 47,
      "change": "+8.2%"
    },
    "products": {
      "total": 23,
      "active": 20,
      "draft": 3
    },
    "customers": {
      "total": 156,
      "change": "+15.3%"
    },
    "topProducts": [
      {
        "name": "Digital Art #1",
        "sales": 23,
        "revenue": "57.5"
      }
    ],
    "recentOrders": [
      {
        "id": "#ORD-001",
        "customer": "alice.sol",
        "product": "Digital Art #1",
        "amount": "2.5",
        "status": "completed"
      }
    ]
  }
}
```

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

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## Implementation Notes

1. **Solana Integration**: All payments should be processed through Solana blockchain
2. **File Storage**: Product images and digital downloads should use IPFS or similar decentralized storage
3. **Real-time Updates**: Consider WebSocket connections for real-time order status updates
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Caching**: Cache frequently accessed data like store information and product listings
6. **Search**: Implement full-text search for products across stores

## Next Steps

1. Set up backend API with Node.js/Express or similar
2. Implement Solana wallet integration
3. Set up database with the provided schema
4. Implement file upload for store icons and product images
5. Add payment processing with Solana
6. Implement real-time notifications
7. Add comprehensive error handling and validation