# Frontend API Integration

## Overview

The frontend has been integrated with the backend APIs as documented in `API_IMPLEMENTED.md`. The integration includes:

## Files Created/Modified

### New Files Created:
- `lib/api.ts` - API utility functions and error handling
- `lib/wallet.ts` - Solana wallet integration service
- `lib/validation.ts` - Form validation utilities
- `hooks/useWallet.ts` - React hook for wallet management
- `components/ui/loading.tsx` - Loading spinner component
- `components/ui/toast.tsx` - Toast notification system
- `.env.local` - Environment configuration

### Modified Files:
- `app/onboard/page.tsx` - Complete API integration for store creation flow

## Features Implemented

### 1. Wallet Integration
- Phantom wallet detection and connection
- Wallet signature authentication with backend
- JWT token management
- Automatic wallet state management

### 2. Store Creation Flow
- Step-by-step store creation wizard
- Real-time slug availability checking
- File upload for store icons (with validation)
- Form validation and error handling
- Loading states and user feedback

### 3. API Integration
- Complete integration with all backend endpoints
- Error handling with user-friendly messages
- File upload with progress indication
- Automatic token management

## Usage

### Environment Setup
1. Copy `.env.local` and configure your API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/v1
```

### Wallet Connection
The app automatically detects Phantom wallet and guides users through connection:
```typescript
const { isConnected, connectWallet, walletAddress } = useWallet();
```

### API Calls
All API calls are handled through the centralized API service:
```typescript
import { storeApi, authApi, uploadApi } from '@/lib/api';

// Create store
const store = await storeApi.createStore({
  storeName: 'My Store',
  storeSlug: 'my-store',
  description: 'Store description'
});
```

## Error Handling

The integration includes comprehensive error handling:
- Network errors
- API validation errors
- Wallet connection errors
- File upload errors

## Security Features

- JWT token automatic management
- Wallet signature verification
- Input validation and sanitization
- File type and size validation

## Next Steps

To complete the integration:

1. **Start Backend Server**: Ensure your backend API is running on `http://localhost:4000`

2. **Install Phantom Wallet**: Users need Phantom wallet browser extension

3. **Test Flow**:
   - Visit `/onboard`
   - Connect Phantom wallet
   - Complete store creation steps
   - Verify store creation in backend

4. **Additional Pages**: Apply similar integration patterns to:
   - Admin dashboard (`/admin`)
   - Store management pages
   - Product management
   - Order management

## API Endpoints Used

- `POST /v1/auth/wallet/connect` - Wallet authentication
- `GET /v1/auth/verify` - Token verification
- `POST /v1/stores` - Create store
- `GET /v1/stores/{slug}` - Check slug availability
- `POST /v1/upload/store-icon` - Upload store icon

## Dependencies

The integration uses only built-in Next.js and React features:
- No additional dependencies required
- Uses native fetch API
- Leverages React hooks and context
- TypeScript for type safety