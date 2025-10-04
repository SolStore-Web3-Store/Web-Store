# Products API - Frontend Integration Guide

This guide provides complete request and response documentation for the `/products` endpoints to help frontend developers integrate with the Products API.

## Base URL
```
/api/stores/:storeId/products
```

## Authentication
Most endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints Overview

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/:storeId/products` | ✅ | Create a new product |
| GET | `/:storeId/products` | ❌ | Get all products for a store |
| GET | `/:storeId/products/:productId` | ❌ | Get a single product |
| PUT | `/:storeId/products/:productId` | ✅ | Update a product |
| DELETE | `/:storeId/products/:productId` | ✅ | Delete a product |

---

## 1. Create Product

### Request
```http
POST /api/stores/{storeId}/products
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body
```typescript
interface CreateProductRequest {
  name: string;                    // Required, 1-255 chars
  description?: string;            // Optional, max 2000 chars
  price: number;                   // Required, min 0
  currency?: 'SOL' | 'USDC';      // Optional, defaults to 'SOL'
  category?: string;               // Optional, max 100 chars
  stock?: number | 'unlimited';    // Optional, integer >= 0 or 'unlimited'
  images?: string[];               // Optional, array of image URLs
  status?: 'active' | 'draft' | 'inactive'; // Optional, defaults to 'active'
  metadata?: {                     // Optional
    downloadUrl?: string;
    fileSize?: string;
    fileType?: string;
  };
}
```

### Example Request
```json
{
  "name": "Digital Art Collection",
  "description": "Beautiful digital artwork NFT",
  "price": 0.5,
  "currency": "SOL",
  "category": "Digital Art",
  "stock": 100,
  "images": ["https://example.com/image1.jpg"],
  "status": "active",
  "metadata": {
    "downloadUrl": "https://example.com/download",
    "fileSize": "2.5MB",
    "fileType": "PNG"
  }
}
```

### Success Response (201)
```typescript
interface CreateProductResponse {
  success: true;
  data: {
    id: string;
    name: string;
    description: string | null;
    price: string;                 // Decimal as string
    currency: string;
    category: string | null;
    stock: number | 'unlimited';
    sales: number;                 // Always 0 for new products
    revenue: string;               // Always '0' for new products
    status: 'active' | 'draft' | 'inactive';
    createdAt: string;             // ISO date string
  };
}
```

---

## 2. Get Store Products

### Request
```http
GET /api/stores/{storeId}/products?page=1&limit=20&status=active&category=art&search=digital
```

### Query Parameters
```typescript
interface ProductQueryParams {
  page?: number;        // Default: 1, min: 1
  limit?: number;       // Default: 20, min: 1, max: 100
  status?: 'active' | 'draft' | 'inactive';
  category?: string;
  search?: string;      // Searches name and description
}
```

### Success Response (200)
```typescript
interface GetProductsResponse {
  success: true;
  data: {
    products: Array<{
      id: string;
      name: string;
      description: string | null;
      price: string;               // Decimal as string
      currency: string;
      sales: number;               // Total completed sales
      revenue: string;             // Total revenue as string
      status: 'active' | 'draft' | 'inactive';
      category: string | null;
      stock: number | 'unlimited';
      images: string[];            // Array of image URLs
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;               // Total products count
      totalPages: number;
    };
  };
}
```

### Example Response
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123",
        "name": "Digital Art Collection",
        "description": "Beautiful digital artwork NFT",
        "price": "0.5",
        "currency": "SOL",
        "sales": 15,
        "revenue": "7.5",
        "status": "active",
        "category": "Digital Art",
        "stock": 85,
        "images": ["https://example.com/image1.jpg"]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

## 3. Get Single Product

### Request
```http
GET /api/stores/{storeId}/products/{productId}
```

### Success Response (200)
```typescript
interface GetProductResponse {
  success: true;
  data: {
    id: string;
    name: string;
    description: string | null;
    price: string;
    currency: string;
    category: string | null;
    stock: number | 'unlimited';
    images: string[];
    metadata: object;              // Custom metadata object
    status: 'active' | 'draft' | 'inactive';
    sales: number;                 // Total completed sales
    store: {
      name: string;
      slug: string;
    };
    createdAt: string;             // ISO date string
  };
}
```

---

## 4. Update Product

### Request
```http
PUT /api/stores/{storeId}/products/{productId}
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body
```typescript
interface UpdateProductRequest {
  name?: string;                   // 1-255 chars
  description?: string;            // Max 2000 chars
  price?: number;                  // Min 0
  currency?: 'SOL' | 'USDC';
  category?: string;               // Max 100 chars
  stock?: number | 'unlimited';    // Integer >= 0 or 'unlimited'
  images?: string[];               // Array of image URLs
  status?: 'active' | 'draft' | 'inactive';
  metadata?: object;               // Any custom metadata
}
```

### Success Response (200)
```typescript
interface UpdateProductResponse {
  success: true;
  data: {
    id: string;
    name: string;
    description: string | null;
    price: string;
    currency: string;
    category: string | null;
    stock: number | 'unlimited';
    status: 'active' | 'draft' | 'inactive';
    updatedAt: string;             // ISO date string
  };
}
```

---

## 5. Delete Product

### Request
```http
DELETE /api/stores/{storeId}/products/{productId}
Authorization: Bearer <token>
```

### Success Response (200)
```typescript
interface DeleteProductResponse {
  success: true;
  data: {
    message: string;               // "Product deleted successfully"
  };
}
```

---

## Error Responses

All endpoints return consistent error responses:

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
```

### Common Error Codes

| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid request data |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication |
| 404 | `NOT_FOUND` | Store or product not found |
| 500 | `INTERNAL_SERVER_ERROR` | Server error |

### Example Error Response
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Product not found"
  }
}
```

---

## Frontend Integration Examples

### React/TypeScript Example

```typescript
// API client
class ProductsAPI {
  private baseUrl = '/api/stores';
  
  async createProduct(storeId: string, productData: CreateProductRequest, token: string) {
    const response = await fetch(`${this.baseUrl}/${storeId}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    
    return response.json() as Promise<CreateProductResponse>;
  }
  
  async getProducts(storeId: string, params?: ProductQueryParams) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    
    const response = await fetch(`${this.baseUrl}/${storeId}/products?${searchParams}`);
    return response.json() as Promise<GetProductsResponse>;
  }
}
```

### JavaScript/Fetch Example

```javascript
// Get products with pagination
async function fetchProducts(storeId, page = 1, limit = 20) {
  try {
    const response = await fetch(`/api/stores/${storeId}/products?page=${page}&limit=${limit}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data.products;
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

// Create new product
async function createProduct(storeId, productData, authToken) {
  try {
    const response = await fetch(`/api/stores/${storeId}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(productData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}
```

---

## Notes for Frontend Developers

1. **Price Handling**: Prices are returned as strings to maintain decimal precision. Convert to numbers only for calculations.

2. **Stock Management**: Stock can be either a number or the string `'unlimited'`. Handle both cases in your UI.

3. **Image Arrays**: Images are stored as arrays of URLs. Always check if the array exists and has items before accessing.

4. **Status Values**: Product status values are lowercase in responses (`'active'`, `'draft'`, `'inactive'`).

5. **Pagination**: Always implement pagination for product lists to handle large inventories efficiently.

6. **Error Handling**: Always check the `success` field in responses and handle errors appropriately.

7. **Authentication**: Store and product management endpoints require authentication. Public viewing endpoints do not.