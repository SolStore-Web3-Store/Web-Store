"use client";
import React from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCart, CartItem } from '@/hooks/useCart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  storeSlug: string;
  showAddedMessage?: boolean;
  onClearAddedMessage?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  storeSlug, 
  showAddedMessage = false, 
  onClearAddedMessage 
}) => {
  const { cart, updateQuantity, removeFromCart, clearCart, getStoreItems } = useCart();
  
  // Get items for current store only
  const storeItems = getStoreItems(storeSlug);
  const storeTotal = storeItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const storeItemCount = storeItems.reduce((sum, item) => sum + item.quantity, 0);

  console.log('CartDrawer render - storeSlug:', storeSlug);
  console.log('CartDrawer render - cart:', cart);
  console.log('CartDrawer render - storeItems:', storeItems);
  console.log('CartDrawer render - storeItemCount:', storeItemCount);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    // Close the cart drawer
    onClose();
    
    // Navigate to checkout page
    window.location.href = `/${storeSlug}/checkout`;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Shopping Cart
              </h2>
              {storeItemCount > 0 && (
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full">
                  {storeItemCount} {storeItemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Success Message */}
          {showAddedMessage && (
            <div className="bg-green-50 border-b border-green-200 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-800 font-medium">
                    Item added to cart!
                  </span>
                </div>
                {onClearAddedMessage && (
                  <button
                    onClick={onClearAddedMessage}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}



          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {storeItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 text-xs mb-4">
                  Browse products and add them to your cart to get started!
                </p>
                <button
                  onClick={onClose}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {storeItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {storeItems.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Subtotal ({storeItemCount} {storeItemCount === 1 ? 'item' : 'items'}):</span>
                  <span>{storeTotal.toFixed(2)} {storeItems[0]?.currency || 'SOL'}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span className="text-indigo-600">
                    {storeTotal.toFixed(2)} {storeItems[0]?.currency || 'SOL'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg shadow-md"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onQuantityChange, onRemove }) => {
  const itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2);

  return (
    <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-start gap-3">
        {/* Product Image */}
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-medium text-gray-900 mb-1">
            {item.name}
          </h4>
          <p className="text-xs text-gray-600 mb-2">
            {item.price} {item.currency} each
          </p>
          <p className="text-xs font-semibold text-gray-900">
            Total: {itemTotal} {item.currency}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="p-1 hover:bg-red-100 rounded-lg transition-colors text-red-500 hover:text-red-700"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">Quantity:</span>
        <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-3 py-2">
          <button
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value) || 1;
              if (newQuantity > 0) {
                onQuantityChange(item.id, newQuantity);
              }
            }}
            className="w-12 text-center text-xs font-medium text-gray-900 bg-transparent border-none outline-none"
            min="1"
          />
          
          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};