"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  Menu,
  Search,
  ShoppingCart,
  Home,
  Share2,
  Globe,
  ChevronDown,
  ChevronUp,
  Star,
  AlertCircle,
  Package,
  Grid,
  List,
  PackagePlus,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { storeApi, ApiError } from '@/lib/api';
import { Loading } from '@/components/ui/loading';
import { useCart } from '@/hooks/useCart';
import { CartDrawer } from '@/components/ui/cart-drawer';
import { ProductDetailsModal } from '@/components/ui/product-details-modal';

import { MdOutlineReport } from 'react-icons/md';

interface StorePageProps {
  params: Promise<{
    storeSlug: string;
  }>;
}

interface StoreSettings {
  currency?: string;
  language?: string;
  timezone?: string;
  theme?: string;
}

interface StoreData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  banner?: string;
  settings: unknown;
  owner: {
    walletAddress: string;
  };
}

// Helper function to safely access store settings
const getStoreSettings = (settings: unknown): StoreSettings => {
  if (typeof settings === 'object' && settings !== null) {
    return settings as StoreSettings;
  }
  return {};
};

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  category: string | null;
  stock: number | "unlimited";
  images: string[];
  status: "active" | "draft" | "inactive";
  sales: number;
  revenue: string;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Main Page Component
export default function Store({ params }: StorePageProps) {
  const [storeSlug, setStoreSlug] = useState<string>('');
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);
  const [isFilterCategoryExpanded, setIsFilterCategoryExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Cart functionality
  const { cart, addToCart, getStoreItems, removeFromCart } = useCart();

  // Filter and Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLanguage] = useState('English');

  // Extract store slug from params
  useEffect(() => {
    params.then((resolvedParams) => {
      setStoreSlug(resolvedParams.storeSlug);
    });
  }, [params]);

  // Load store data
  useEffect(() => {
    const loadStoreData = async () => {
      if (!storeSlug) return;

      try {
        setLoading(true);
        setError(null);

        const store = await storeApi.getStoreBySlug(storeSlug);
        setStoreData(store);
      } catch (err) {
        console.error('Error loading store:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load store data');
        }
      } finally {
        setLoading(false);
      }
    };

    loadStoreData();
  }, [storeSlug]);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      if (!storeSlug) return;

      try {
        setProductsLoading(true);

        const products = await storeApi.getStoreProductsBySlug(storeSlug, {
          page: currentPage,
          limit: 12,
          status: 'active',
          category: selectedCategory || undefined,
          search: searchQuery || undefined,
        });

        setProductsData(products);
      } catch (err) {
        console.error('Error loading products:', err);
        // Don't show error for products, just show empty state
      } finally {
        setProductsLoading(false);
      }
    };

    if (storeData) {
      loadProducts();
    }
  }, [storeSlug, storeData, currentPage, selectedCategory, searchQuery]);

  // Get unique categories from products
  const categories = useMemo(() => {
    if (!productsData?.products) return [];
    const categorySet = new Set(
      productsData.products
        .map(p => p.category)
        .filter((category): category is string => Boolean(category))
    );
    return Array.from(categorySet);
  }, [productsData]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page
  };

  // Handle add to cart
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    console.log('handleAddToCart called with:', product, 'quantity:', quantity);
    console.log('Current storeSlug:', storeSlug);

    // Add multiple items if quantity > 1
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        images: product.images,
        storeSlug: storeSlug
      });
    }

    // Show success message and open cart
    setShowAddedMessage(true);
    setIsCartOpen(true);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setShowAddedMessage(false);
    }, 3000);
  };

  // Handle buy now - adds to cart and redirects to checkout
  const handleBuyNow = (product: Product, quantity: number = 1) => {
    console.log('handleBuyNow called with:', product, 'quantity:', quantity);

    // Clear existing cart items for this store to ensure only this product is purchased
    const storeItems = getStoreItems(storeSlug);
    storeItems.forEach(item => {
      removeFromCart(item.id);
    });

    // Add the product to cart
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      images: product.images,
      storeSlug: storeSlug
    });

    // Redirect to checkout
    window.location.href = `/${storeSlug}/checkout`;
  };

  // Handle product click to open details modal
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  // Handle closing product modal
  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  // Get cart items for current store
  const storeCartItems = getStoreItems(storeSlug);
  const cartItemCount = storeCartItems.reduce((sum, item) => sum + item.quantity, 0);

  console.log('Store page - storeSlug:', storeSlug);
  console.log('Store page - cart:', cart);
  console.log('Store page - storeCartItems:', storeCartItems);
  console.log('Store page - cartItemCount:', cartItemCount);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (!productsData?.products) return [];

    const products = [...productsData.products];

    switch (sortBy) {
      case 'price-low':
        return products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-high':
        return products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'name':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'latest':
      default:
        // Since we don't have createdAt, just return products as they come from API
        // The API likely returns them in the correct order already
        return products;
    }
  }, [productsData?.products, sortBy]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Store Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || 'The store you are looking for does not exist or is not available.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-white text-black">
      {/* Sidebar - Hidden on mobile, shown as drawer */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900"><Menu /></h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-2">
            <Link
              href={`/${storeSlug}`}
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Home
            </Link>

            {/* Category Dropdown */}
            <div>
              <button
                onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryExpanded ? 'rotate-180' : ''}`} />
              </button>
              {isCategoryExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  <button
                    onClick={() => {
                      handleCategoryChange('');
                      setIsSidebarOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${selectedCategory === ''
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        handleCategoryChange(category);
                        setIsSidebarOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${selectedCategory === category
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 sm:p-4 border-t border-gray-200 space-y-2">

            <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              <Share2 className="w-4 h-4 mr-3" />
              Share Store
            </button>
            <button className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-3" />
                <span>{selectedLanguage}</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-3 sm:px-4 py-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md text-black"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {storeData.name}
                </h1>
                <span className="hidden sm:inline text-gray-400">|</span>
                <span className="hidden sm:inline text-sm text-gray-600">SolStore</span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">

              <button className='flex items-center gap-1 px-4 py-2 rounded-md bg-red-500 text-white text-sm '>
                <MdOutlineReport className='mr-3' /> Report Seller
              </button>
              {/* Search Button - Mobile */}
              <button
                className="sm:hidden p-2 hover:bg-gray-100 rounded-md text-black"
                onClick={() => {
                  // Focus search input in mobile
                  const searchInput = document.querySelector('input[placeholder="Search products..."]') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.focus();
                    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-md text-black"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section with Store Profile */}
        <section className="relative bg-white">
          {/* Banner Image */}
          {storeData.banner && (
            <div className="h-32 sm:h-40 md:h-48 lg:h-64 overflow-hidden">
              <Image
                src={storeData.banner}
                alt={`${storeData.name} banner`}
                width={1200}
                height={300}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}

          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 md:py-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Store Icon */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                  {storeData.icon ? (
                    <Image
                      src={storeData.icon}
                      alt={storeData.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-sm sm:text-xl md:text-2xl lg:text-4xl font-bold">
                        {storeData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Store Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 break-words">
                  {storeData.name}
                </h1>
                {storeData.description && (
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-4 max-w-2xl break-words">
                    {storeData.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{getStoreSettings(storeData.settings).language || 'English'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                    <span>{productsData?.pagination.total || 0} products</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 flex-shrink-0" />
                    <span>Web3 Store</span>
                  </span>
                </div>
              </div>

              {/* Store Actions */}
              <div className="flex flex-row items-center justify-between  gap-2 w-full sm:w-auto text-sm">

                <button className="flex items-center w-full px-3 py-2 text-sm bg-blue-600  text-white hover:bg-gray-500 rounded-md transition-colors">
                  <Share2 className="w-4 h-4 mr-3" />
                  Share Store
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-gray-50 py-4 sm:py-6 px-3 sm:px-4 lg:px-6 border-y border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row lg:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              {/* Search Bar */}
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black bg-white text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 sm:p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                    title="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 sm:p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="w-40 sm:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer text-black text-sm sm:text-base"
                  >
                    <option value="latest">Latest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-xs text-gray-600 flex-shrink-0">Active filters:</span>
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                    <span className="truncate max-w-24 sm:max-w-none">{selectedCategory}</span>
                    <button
                      onClick={() => handleCategoryChange('')}
                      className="ml-1 hover:text-indigo-600 flex-shrink-0"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                    <span className="truncate max-w-24 sm:max-w-none">&quot;{searchQuery}&quot;</span>
                    <button
                      onClick={() => handleSearch('')}
                      className="ml-1 hover:text-indigo-600 flex-shrink-0"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Products Section */}
        <section className="flex flex-col w-full bg-white py-6 sm:py-8 px-3 sm:px-4 lg:px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Filters Sidebar - Hidden on mobile, shown on desktop */}
              <aside className="hidden lg:block lg:w-64 space-y-4 flex-shrink-0">
                {/* Categories Filter */}
                {categories.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <button
                      onClick={() => setIsFilterCategoryExpanded(!isFilterCategoryExpanded)}
                      className="flex items-center justify-between w-full text-sm font-medium text-gray-900"
                    >
                      <span>Categories</span>
                      {isFilterCategoryExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {isFilterCategoryExpanded && (
                      <div className="mt-4 space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === ''}
                            onChange={() => handleCategoryChange('')}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>All Categories</span>
                        </label>
                        {categories.map((category) => (
                          <label key={category} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                            <input
                              type="radio"
                              name="category"
                              checked={selectedCategory === category}
                              onChange={() => handleCategoryChange(category)}
                              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="truncate">{category}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Store Info */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Store Info</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 flex-shrink-0" />
                      <span>{productsData?.pagination.total || 0} products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 flex-shrink-0" />
                      <span>{getStoreSettings(storeData.settings).currency || 'SOL'}</span>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Products Grid/List */}
              <div className="flex flex-col w-full min-w-0">
                {productsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loading />
                  </div>
                ) : sortedProducts.length > 0 ? (
                  <>
                    {/* Products Count */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <p className="text-xs sm:text-sm text-gray-600">
                        Showing {sortedProducts.length} of {productsData?.pagination.total || 0} products
                      </p>
                    </div>

                    {/* Products Grid */}
                    <div className={`grid gap-4 sm:gap-6 ${viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                      : 'grid-cols-1'
                      }`}>
                      {sortedProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className={`flex flex-col h-full justify-between bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer ${viewMode === 'list' ? 'flex-row' : 'flex-col'
                            }`}
                        >
                          {/* Product Image */}
                          <div className={`bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden ${viewMode === 'list'
                            ? 'w-24 sm:w-32 md:w-40 lg:w-48 h-24 sm:h-32 md:h-40 lg:h-48 rounded-l-lg'
                            : 'w-full aspect-square rounded-t-lg'
                            }`}>
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={viewMode === 'list' ? 192 : 300}
                                height={viewMode === 'list' ? 192 : 300}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                loading="lazy"
                              />
                            ) : (
                              <Package className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-400" />
                            )}
                          </div>

                          {/* Product Info */}
                          <div className={`flex flex-col justify-between p-3 sm:p-4 ${viewMode === 'list' ? 'flex-1 min-w-0' : 'w-full'}`}>
                            <div className="min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className={`font-medium truncate text-gray-900 line-clamp-2 ${viewMode === 'list' ? 'text-sm sm:text-base md:text-lg' : 'text-sm sm:text-base'
                                  }`}>
                                  {product.name}
                                </h3>
                                {product.category && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                                    {product.category}
                                  </span>
                                )}
                              </div>

                              {product.description && viewMode === 'list' && (
                                <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col gap-3 mt-auto justify-between h-full">
                              <div className='flex items-center gap-1 flex-wrap'>
                                <Image
                                  src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAASFBMVEVHcExYmddlgeAu1r5Irc5Hrc2JU/WKVPYj6q1reeMl5bOJUfWUSP0k5rNQndRcjdsd9KU4xsR9YO5pfOIt2b1DtctJqs9ybugVOp/+AAAAC3RSTlMAHE9DQ09NMjJDT2HHxPcAAACSSURBVCiRxdDBDoMgEEVRUMtUoFpB5f//tIPTyJOkpJumd3uCPlDqf+l7Fdiwbcuyrg/uKRWlad+vWkzPEyqzLRbnSosp3XE3yeZwTTszHg25nsOT5EJIUX4sV7JN7T+ojMYvG+dCSqgaz75HySqehdiMzFF3vgecNN7lYLQG4y5ajLyvlGo7NcUR11R9fY0f9AL+uBAN6GmI1QAAAABJRU5ErkJggg=='}
                                  height={20}
                                  width={20}
                                  alt='Solana currency'
                                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                                />
                                <p className={`flex gap-1 items-center font-semibold text-gray-900 ${viewMode === 'list' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                                  }`}>
                                  {product.price} {product.currency}
                                </p>
                                <div className="text-xs">
                                  {product.stock === 'unlimited' ? (
                                    <span className="text-green-600 font-medium">✓ In Stock</span>
                                  ) : typeof product.stock === 'number' && product.stock > 0 ? (
                                    <span className="text-green-600 font-medium">
                                      ✓ {product.stock} in stock
                                    </span>
                                  ) : (
                                    <span className="text-red-600 font-medium">✗ Out of Stock</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 h-full">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(product);
                                  }}
                                  className="flex items-center justify-center gap-1.5 bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-xs sm:text-sm font-medium flex-1"
                                >
                                  <PackagePlus size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span>Add to Cart</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBuyNow(product);
                                  }}
                                  className="flex items-center justify-center gap-1.5 bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors text-xs sm:text-sm font-medium flex-1"
                                >
                                  <ShoppingCart size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span>Buy Now</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {productsData && productsData.pagination.totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
                        >
                          Previous
                        </button>

                        <span className="px-4 py-2 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          Page {currentPage} of {productsData.pagination.totalPages}
                        </span>

                        <button
                          onClick={() => setCurrentPage(Math.min(productsData.pagination.totalPages, currentPage + 1))}
                          disabled={currentPage === productsData.pagination.totalPages}
                          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  /* Empty State */
                  <div className="text-center py-8 sm:py-12 px-4">
                    <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      {searchQuery || selectedCategory ? 'No products found' : 'No products yet'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-md mx-auto">
                      {searchQuery || selectedCategory
                        ? 'Try adjusting your search or filters to find what you\'re looking for.'
                        : 'This store hasn\'t added any products yet. Check back later!'
                      }
                    </p>
                    {(searchQuery || selectedCategory) && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('');
                        }}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm sm:text-base"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 sm:py-8 px-3 sm:px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm text-gray-700 w-full sm:w-auto justify-center"
                >
                  <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">Create your SolStore Today</span>
                </Link>

                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-gray-500">
                  <span className='flex gap-2 sm:gap-4 items-center'>
                    <span className="whitespace-nowrap">Powered by</span>
                    <Image
                      src={'https://earn.superteam.fun/assets/solana-powered.svg'}
                      className='rounded-md'
                      width={120}
                      height={24}
                      alt='superteam_logo'
                    />
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="whitespace-nowrap">Web3 Commerce</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-right text-xs text-gray-500">
                <p className="whitespace-nowrap">© 2025 {storeData.name}</p>
                <span className="hidden sm:inline">•</span>
                <p className="whitespace-nowrap">
                  Owner: {storeData.owner.walletAddress.slice(0, 4)}...{storeData.owner.walletAddress.slice(-4)}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        storeSlug={storeSlug}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeSlug={storeSlug}
        showAddedMessage={showAddedMessage}
        onClearAddedMessage={() => setShowAddedMessage(false)}
      />
    </div>
  );
}