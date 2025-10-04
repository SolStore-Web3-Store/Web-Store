# Real Solana Wallet Integration Guide

## Overview

This guide explains how the real Solana wallet integration works in SolStore, using actual Phantom wallet connection and message signing.

## Implementation Details

### 1. **Real Wallet Connection Flow**

```typescript
// 1. Detect Phantom Wallet
const detected = await walletService.detectWallet();

// 2. Connect to Phantom
const address = await walletService.connectWallet();

// 3. Sign Authentication Message
const message = `Sign in to SolStore\nTimestamp: ${Date.now()}`;
const signature = await walletService.signMessage(message);

// 4. Send to Backend for Verification
const authResult = await authApi.connectWallet(address, signature, message);
```

### 2. **Key Components**

#### **WalletService (`lib/wallet.ts`)**

- Real Phantom wallet detection and connection
- Message signing with proper Solana standards
- Base58 signature encoding (Solana standard)
- Error handling for all wallet interaction scenarios

#### **WalletConnectButton (`components/wallet/wallet-connect-button.tsx`)**

- Complete UI for wallet connection
- Installation instructions for Phantom
- Connection status and error handling
- Disconnect functionality

#### **useWallet Hook (`hooks/useWallet.ts`)**

- React state management for wallet connection
- Automatic reconnection on page load
- Error state management

### 3. **Real vs Demo Mode**

#### **Real Mode (Backend Available)**

- Actual Phantom wallet connection
- Real message signing with user's private key
- Backend verification of signatures
- JWT token authentication
- Persistent authentication across sessions

#### **Demo Mode (Backend Unavailable)**

- Still uses real Phantom wallet connection
- Mock backend responses for development
- Local storage for demo data
- Seamless fallback when backend is down

### 4. **Security Features**

#### **Message Signing**

```typescript
// Message format for authentication
const message = `Sign in to SolStore\nTimestamp: ${Date.now()}`;

// Signed with user's private key in Phantom
const signature = await wallet.signMessage(encodedMessage, "utf8");

// Converted to Base58 (Solana standard)
const signatureBase58 = bs58.encode(signature);
```

#### **Backend Verification**

- Server verifies signature matches wallet address
- Timestamp prevents replay attacks
- JWT tokens for session management
- Secure authentication without exposing private keys

### 5. **Error Handling**

#### **Common Scenarios**

- **User Rejection**: Clear message to retry and approve
- **Wallet Locked**: Instructions to unlock Phantom
- **Network Issues**: Fallback to demo mode
- **Backend Down**: Automatic demo mode activation

#### **Error Codes**

- `4001`: User rejected request
- `-32002`: Request already pending
- `-32603`: Wallet locked
- `NETWORK_ERROR`: Backend unavailable

### 6. **Testing the Integration**

#### **Test Page**: `/test-wallet`

Visit `http://localhost:3000/test-wallet` to test:

- Wallet detection and connection
- Message signing functionality
- Backend authentication flow
- Error handling scenarios

#### **Manual Testing Steps**

1. **Install Phantom**: https://phantom.app/
2. **Create/Import Wallet**: Set up Solana wallet
3. **Test Connection**: Visit test page and connect
4. **Test Signing**: Sign test messages
5. **Test Backend**: Authenticate with backend API

### 7. **Integration with Onboard Flow**

#### **Step 0: Wallet Connection**

- Real Phantom wallet connection
- Automatic backend authentication
- Visual feedback for all states
- Clear error messages and solutions

#### **Subsequent Steps**

- Wallet address used for store ownership
- Authentication token for API calls
- Persistent session across page reloads

### 8. **Dependencies**

```json
{
  "@solana/web3.js": "^1.95.4",
  "@solana/wallet-adapter-base": "^0.9.23",
  "@solana/wallet-adapter-phantom": "^0.9.24",
  "bs58": "^6.0.0"
}
```

### 9. **Environment Configuration**

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/v1
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### 10. **Backend API Integration**

#### **Authentication Endpoint**

```http
POST /v1/auth/wallet/connect
Content-Type: application/json

{
  "walletAddress": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  "signature": "base58_encoded_signature",
  "message": "Sign in to SolStore\nTimestamp: 1704067200000"
}
```

#### **Response**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "walletAddress": "wallet_address",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 11. **Production Considerations**

#### **Security**

- Always verify signatures on backend
- Use HTTPS in production
- Implement rate limiting
- Validate wallet addresses

#### **User Experience**

- Clear installation instructions
- Helpful error messages
- Loading states for all operations
- Offline/demo mode fallback

#### **Performance**

- Lazy load wallet detection
- Cache connection status
- Minimize wallet interactions
- Efficient error handling

### 12. **Troubleshooting**

#### **Common Issues**

1. **"Phantom not detected"**: Install Phantom wallet extension
2. **"User rejected"**: Approve connection in Phantom popup
3. **"Wallet locked"**: Unlock Phantom with password
4. **"Backend error"**: Start backend server or use demo mode

#### **Debug Mode**

Enable debug logging in development:

```typescript
// Check browser console for detailed logs
// [SolStore Debug] Wallet connection - Requesting wallet connection...
// [SolStore Debug] Message signed successfully
```

### 13. **Next Steps**

After wallet integration:

1. **Store Creation**: Use authenticated wallet for store ownership
2. **Product Management**: Wallet-based permissions
3. **Payment Processing**: SOL payments to connected wallet
4. **Transaction History**: Track wallet transactions

## Quick Start

1. **Install Phantom**: https://phantom.app/
2. **Start Backend**: `npm run dev` in backend folder
3. **Start Frontend**: `npm run dev` in frontend folder
4. **Test Connection**: Visit `/test-wallet`
5. **Use Onboard**: Visit `/onboard` and connect wallet

The integration provides a complete, production-ready Solana wallet connection system with proper security, error handling, and user experience.
