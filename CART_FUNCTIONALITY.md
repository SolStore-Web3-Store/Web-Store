# Cart Functionality

This document describes the cart functionality implemented for the SolStore application.

## Overview

The cart functionality allows users to:
- Add products to their cart from any store page
- View cart contents in a left-sliding drawer
- Update product quantities
- Remove items from cart
- Persist cart data in localStorage
- Store-specific cart management (items are filtered by store)

## Components

### 1. useCart Hook (`hooks/useCart.ts`)
A custom React hook that manages cart state and provides cart operations:

**Features:**
- Persistent storage using localStorage
- Add/remove/update cart items
- Calculate totals and item counts
- Store-specific item filtering
- Automatic state synchronization

**Key Functions:**
- `addToCart(product)` - Adds a product to cart or increases quantity
- `removeFromCart(productId)` - Removes item completely from cart
- `updateQuantity(productId, quantity)` - Updates item quantity
- `clearCart()` - Empties the entire cart
- `getStoreItems(storeSlug)` - Gets items for specific store

### 2. CartDrawer Component (`components/ui/cart-drawer.tsx`)
A slide-out drawer component that displays cart contents:

**Features:**
- Right-sliding drawer animation
- Store-specific item display
- Enhanced quantity controls (+/- buttons + input field)
- Remove item functionality with confirmation
- Individual item totals and cart total
- Success message when items are added
- Improved empty state with "Continue Shopping" button
- Prominent checkout button with total summary

### 3. Store Page Integration (`app/[storeSlug]/page.tsx`)
The store page has been updated to include cart functionality:

**Changes:**
- Added cart icon with item count badge in header
- "Add to Cart" buttons on all products
- Cart drawer integration with automatic opening on add
- Success message display when items are added
- Store-specific cart item filtering
- Automatic cart opening when items are added

## Usage

### Adding Items to Cart
```typescript
const { addToCart } = useCart();

// Add a product to cart
addToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  currency: product.currency,
  images: product.images,
  storeSlug: storeSlug
});
```

### Opening Cart Drawer
```typescript
const [isCartOpen, setIsCartOpen] = useState(false);

// Open cart drawer
<button onClick={() => setIsCartOpen(true)}>
  <ShoppingCart />
</button>

// Cart drawer component
<CartDrawer 
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
  storeSlug={storeSlug}
/>
```

## Data Structure

### CartItem Interface
```typescript
interface CartItem {
  id: string;           // Product ID
  name: string;         // Product name
  price: string;        // Product price
  currency: string;     // Price currency (SOL, USDC, etc.)
  image?: string;       // Product image URL
  quantity: number;     // Quantity in cart
  storeSlug: string;    // Store identifier
}
```

### Cart Interface
```typescript
interface Cart {
  items: CartItem[];    // Array of cart items
  total: number;        // Total cart value
  itemCount: number;    // Total number of items
}
```

## Storage

Cart data is automatically persisted to localStorage with the key `solstore_cart`. The cart state is:
- Loaded on component mount
- Saved whenever cart state changes
- Shared across browser tabs/windows
- Persists between browser sessions

## Store Isolation

Each store's cart is isolated - when viewing a store page, only items from that specific store are displayed in the cart drawer. However, the global cart maintains items from all stores.

## Future Enhancements

- Checkout integration with Solana wallet
- Cart expiration/cleanup
- Product availability checking
- Price change notifications
- Cart sharing functionality
- Wishlist integration