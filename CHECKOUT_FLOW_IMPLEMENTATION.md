# Checkout Flow Implementation

This document describes the complete checkout flow implementation for SolStore, following the Solana Pay integration pattern.

## Overview

The checkout flow follows this sequence:
1. **Customer initiates checkout** → API creates order & payment URL
2. **Customer pays via Solana Pay** → Transaction happens on blockchain
3. **Frontend polls status** → Calls `GET /:storeId/checkout/:orderId/status` every 2-3 seconds
4. **API verifies payment** → Either automatically via webhook/polling or when status is checked
5. **Frontend shows result** → Success/failure based on API response

## Implementation Structure

### 1. API Integration (`lib/api.ts`)

The checkout endpoints are implemented following the API specification:

```typescript
// Create checkout session
async createCheckoutSession(storeId: string, checkoutData: {
  productId: string;
  quantity?: number;
  customerWallet: string;
  customerEmail?: string;
  currency?: "SOL" | "USDC";
})

// Get payment status (used for polling)
async getCheckoutStatus(storeId: string, orderId: string)

// Verify payment (optional manual verification)
async verifyPayment(storeId: string, verificationData: {
  orderId: string;
  signature?: string;
})
```

### 2. Checkout Hook (`hooks/useCheckout.ts`)

A custom hook that provides:
- Checkout session creation
- Payment status polling
- Payment verification
- Error handling

### 3. Cart Integration (`hooks/useCart.ts`)

Enhanced cart functionality:
- Store-specific cart items
- Quantity management
- Cart persistence in localStorage
- Multi-store support

### 4. Store Page (`app/[storeSlug]/page.tsx`)

**Features Added:**
- **Add to Cart** button on product cards
- **Buy Now** button for immediate checkout
- Product details modal with both options
- Cart drawer integration

**Buy Now Flow:**
1. Clears existing cart items for the store
2. Adds selected product to cart
3. Redirects to checkout page

### 5. Checkout Page (`app/[storeSlug]/checkout/page.tsx`)

**Multi-step checkout process:**

#### Step 1: Form (`'form'`)
- Wallet connection requirement
- Customer email input
- Cart items review
- Order summary

#### Step 2: Processing (`'processing'`)
- Loading state while creating checkout session
- API call to create payment URL

#### Step 3: Payment (`'payment'`)
- Display payment URL and QR code
- Countdown timer for payment expiration
- Real-time status polling every 3 seconds
- "Open in Wallet" button for mobile users

#### Step 4: Success (`'success'`)
- Payment confirmation
- Automatic redirect to success page
- Cart clearing

#### Step 5: Failed (`'failed'`)
- Error display
- Retry options
- Back to store option

**Key Features:**
- **Real-time polling**: Checks payment status every 3 seconds
- **Timeout handling**: Automatic failure when payment expires
- **Mobile-friendly**: QR codes and wallet integration
- **Error recovery**: Retry mechanisms and clear error messages

### 6. Success Page (`app/[storeSlug]/success/page.tsx`)

**Enhanced success page:**
- Order details display
- Transaction signature with blockchain explorer links
- Purchased items list
- Receipt printing option
- Next steps guidance

### 7. Product Details Modal (`components/ui/product-details-modal.tsx`)

**Enhanced modal:**
- Quantity selector
- Both "Add to Cart" and "Buy Now" buttons
- Image gallery
- Product information
- Stock status

## Payment Flow Details

### 1. Checkout Initiation
```typescript
// User clicks "Buy Now" or proceeds from cart
const checkoutData = await storeApi.createCheckoutSession(storeId, {
  productId: item.id,
  quantity: item.quantity,
  customerWallet: walletAddress,
  customerEmail: customerEmail.trim(),
  currency: item.currency as "SOL" | "USDC"
});
```

### 2. Payment Display
- Show Solana Pay URL
- Display QR code for mobile scanning
- Provide "Open in Wallet" button
- Start countdown timer

### 3. Status Polling
```typescript
const pollStatus = async () => {
  const status = await storeApi.getCheckoutStatus(storeData.id, orderId);
  
  if (status.status === 'completed') {
    // Payment successful - redirect to success
    setCurrentStep('success');
    clearCart();
    router.push(`/${storeSlug}/success?orderId=${status.orderId}`);
  } else if (status.status === 'failed') {
    // Payment failed - show error
    setCurrentStep('failed');
  }
  // Continue polling if still pending
};

// Poll every 3 seconds
setInterval(pollStatus, 3000);
```

### 4. Payment Completion
- Automatic detection via polling
- Cart clearing
- Success page redirect
- Transaction details display

## Error Handling

### Network Errors
- Connection failures
- Timeout handling
- Retry mechanisms

### Payment Errors
- Insufficient funds
- Transaction failures
- Expired sessions

### User Experience
- Clear error messages
- Recovery options
- Fallback flows

## Mobile Optimization

### QR Code Integration
- Automatic QR code generation
- Mobile wallet detection
- Deep linking support

### Responsive Design
- Mobile-first checkout flow
- Touch-friendly interfaces
- Optimized button sizes

## Security Considerations

### Wallet Integration
- Secure wallet connection
- Address validation
- Transaction verification

### Data Protection
- Email validation
- Secure API communication
- Error message sanitization

## Testing Scenarios

### Happy Path
1. Add product to cart
2. Connect wallet
3. Enter email
4. Create payment session
5. Complete payment
6. Verify success

### Error Scenarios
1. Network failures
2. Wallet connection issues
3. Payment timeouts
4. Invalid transactions
5. API errors

### Edge Cases
1. Multiple tabs
2. Browser refresh during payment
3. Wallet disconnection
4. Session expiration

## Performance Optimizations

### Polling Strategy
- 3-second intervals for active payments
- Automatic cleanup on completion
- Efficient API calls

### State Management
- Minimal re-renders
- Efficient cart updates
- Proper cleanup

### Loading States
- Progressive loading
- Skeleton screens
- Smooth transitions

## Future Enhancements

### Payment Methods
- Multiple cryptocurrency support
- Fiat payment integration
- Payment method selection

### Advanced Features
- Bulk checkout
- Subscription payments
- Payment scheduling

### Analytics
- Conversion tracking
- Payment success rates
- User behavior analysis

## Deployment Considerations

### Environment Variables
- API endpoints
- Wallet configurations
- Feature flags

### Monitoring
- Payment success rates
- Error tracking
- Performance metrics

### Scaling
- Rate limiting
- Caching strategies
- Database optimization

This implementation provides a complete, production-ready checkout flow that follows Solana Pay best practices and provides an excellent user experience for Web3 commerce.