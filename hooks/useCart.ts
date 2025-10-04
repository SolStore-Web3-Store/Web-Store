"use client";
import { useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  currency: string;
  image?: string;
  quantity: number;
  storeSlug: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'solstore_cart';

// Global cart state to ensure all instances share the same state
let globalCart: Cart = {
  items: [],
  total: 0,
  itemCount: 0
};

// Subscribers for state changes
const subscribers = new Set<() => void>();

// Load initial cart from localStorage
if (typeof window !== 'undefined') {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (savedCart) {
    try {
      globalCart = JSON.parse(savedCart);
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }
}

// Save to localStorage
const saveToStorage = (cart: Cart) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }
};

// Notify all subscribers
const notifySubscribers = () => {
  subscribers.forEach(callback => callback());
};

export const useCart = () => {
  const [cart, setCart] = useState<Cart>(globalCart);

  // Subscribe to global state changes
  useEffect(() => {
    const updateCart = () => {
      setCart({ ...globalCart });
    };
    
    subscribers.add(updateCart);
    
    return () => {
      subscribers.delete(updateCart);
    };
  }, []);

  // Calculate totals
  const calculateTotals = useCallback((items: CartItem[]) => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    return { itemCount, total };
  }, []);

  // Add item to cart
  const addToCart = useCallback((product: {
    id: string;
    name: string;
    price: string;
    currency: string;
    images: string[];
    storeSlug: string;
  }) => {
    console.log('useCart addToCart called with:', product);
    
    const existingItemIndex = globalCart.items.findIndex(item => item.id === product.id);
    let newItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Item exists, increase quantity
      newItems = globalCart.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      console.log('Updated existing item, new items:', newItems);
    } else {
      // New item, add to cart
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        image: product.images[0],
        quantity: 1,
        storeSlug: product.storeSlug
      };
      newItems = [...globalCart.items, newItem];
      console.log('Added new item:', newItem);
      console.log('New items array:', newItems);
    }

    const { itemCount, total } = calculateTotals(newItems);
    globalCart = { items: newItems, itemCount, total };
    console.log('New global cart state:', globalCart);
    
    saveToStorage(globalCart);
    notifySubscribers();
  }, [calculateTotals]);

  // Remove item from cart
  const removeFromCart = useCallback((productId: string) => {
    const newItems = globalCart.items.filter(item => item.id !== productId);
    const { itemCount, total } = calculateTotals(newItems);
    globalCart = { items: newItems, itemCount, total };
    
    saveToStorage(globalCart);
    notifySubscribers();
  }, [calculateTotals]);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newItems = globalCart.items.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    const { itemCount, total } = calculateTotals(newItems);
    globalCart = { items: newItems, itemCount, total };
    
    saveToStorage(globalCart);
    notifySubscribers();
  }, [calculateTotals, removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    globalCart = { items: [], total: 0, itemCount: 0 };
    saveToStorage(globalCart);
    notifySubscribers();
  }, []);

  // Get items for specific store
  const getStoreItems = useCallback((storeSlug: string) => {
    console.log('getStoreItems called with storeSlug:', storeSlug);
    console.log('All cart items:', globalCart.items);
    const filtered = globalCart.items.filter(item => {
      console.log('Comparing item.storeSlug:', item.storeSlug, 'with storeSlug:', storeSlug);
      return item.storeSlug === storeSlug;
    });
    console.log('Filtered items:', filtered);
    return filtered;
  }, []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getStoreItems
  };
};