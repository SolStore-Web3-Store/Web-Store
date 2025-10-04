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
  ExternalLink,
  AlertCircle,
  Package,
  Filter,
  Grid,
  List,
  PackagePlus
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { storeApi, ApiError } from '@/lib/api';
import { Loading } from '@/components/ui/loading';
import { useCart } from '@/hooks/useCart';
import { CartDrawer } from '@/components/ui/cart-drawer';

interface StorePageProps {
  params: Promise<{
    storeSlug: string;
  }>;
}

interface StoreData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  banner?: string;
  settings: {
    currency?: string;
    language?: string;
    timezone?: string;
    theme?: string;
  };
  owner: {
    walletAddress: string;
  };
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  currency: string;
  category?: string;
  stock?: number | string;
  images: string[];
  status: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
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

  // Cart functionality
  const { cart, addToCart, getStoreItems } = useCart();

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
        .filter(Boolean)
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
  const handleAddToCart = (product: Product) => {
    console.log('handleAddToCart called with:', product);
    console.log('Current storeSlug:', storeSlug);
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      images: product.images,
      storeSlug: storeSlug
    });

    // Show success message and open cart
    setShowAddedMessage(true);
    setIsCartOpen(true);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setShowAddedMessage(false);
    }, 3000);
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
        return products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Store Not Found</h2>
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
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>

          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <a
              href="#"
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Home
            </a>

            {/* Category Dropdown */}
            <div>
              <button
                onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span>Category</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryExpanded ? 'rotate-180' : ''}`} />
              </button>
              {isCategoryExpanded && (
                <div className="ml-4 mt-1">
                  <a
                    href="#"
                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Products
                  </a>
                </div>
              )}
            </div>

            <a
              href="#"
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              hello
            </a>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              <Share2 className="w-4 h-4 mr-3" />
              Add to Home Screen
            </button>
            <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              <Share2 className="w-4 h-4 mr-3" />
              Share
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md text-black"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1" />
            
            {/* Debug Info - Remove in production */}
            <div className="text-xs bg-yellow-100 p-2 rounded mr-2">
              Cart: {cart.items.length} | Store: {cartItemCount} | Slug: {storeSlug}
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-md text-black">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-md text-black"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Hero Section with Store Profile */}
        <section className="relative bg-white">
          {/* Banner Image */}
          {storeData.banner && (
            <div className="h-48 md:h-64 overflow-hidden">
              <Image
                src={storeData.banner}
                alt={`${storeData.name} banner`}
                width={1200}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Store Icon */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
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
                      <span className="text-white text-2xl md:text-4xl font-bold">
                        {storeData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Store Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {storeData.name}
                </h1>

                {storeData.description && (
                  <p className="text-gray-600 text-lg mb-4 max-w-2xl">
                    {storeData.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {storeData.settings.language || 'English'}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4" />
                    {productsData?.pagination.total || 0} products
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Web3 Store
                  </span>
                </div>
              </div>

              {/* Store Actions */}
              <div className="flex flex-col gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share Store
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-gray-50 py-6 px-4 border-y border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black bg-white"
                  />
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="lg:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer text-black"
                >
                  <option value="latest">Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {selectedCategory}
                    <button
                      onClick={() => handleCategoryChange('')}
                      className="ml-1 hover:text-indigo-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    &quot;{searchQuery}&quot;
                    <button
                      onClick={() => handleSearch('')}
                      className="ml-1 hover:text-indigo-600"
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
        <section className="flex-1 bg-white py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-64 space-y-4">
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
                            <span>{category}</span>
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
                      <Package className="w-4 h-4" />
                      <span>{productsData?.pagination.total || 0} products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>{storeData.settings.currency || 'SOL'}</span>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Products Grid/List */}
              <div className="flex-1">
                {productsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loading />
                  </div>
                ) : sortedProducts.length > 0 ? (
                  <>
                    {/* Products Count */}
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-sm text-gray-600">
                        Showing {sortedProducts.length} of {productsData?.pagination.total || 0} products
                      </p>
                    </div>

                    {/* Products Grid */}
                    <div className={`grid gap-6 ${viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                      }`}>
                      {sortedProducts.map((product) => (
                        <div
                          key={product.id}
                          className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${viewMode === 'list' ? 'flex' : ''
                            }`}
                        >
                          {/* Product Image */}
                          <div className={`bg-gray-100 flex items-center justify-center ${viewMode === 'list' ? 'w-48 h-32' : 'aspect-square'
                            }`}>
                            {product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={viewMode === 'list' ? 192 : 300}
                                height={viewMode === 'list' ? 128 : 300}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-16 h-16 text-gray-400" />
                            )}
                          </div>

                          {/* Product Info */}
                          <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className={`font-medium text-gray-900 ${viewMode === 'list' ? 'text-lg' : 'text-sm'
                                }`}>
                                {product.name}
                              </h3>
                              {product.category && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  {product.category}
                                </span>
                              )}
                            </div>

                            {product.description && viewMode === 'list' && (
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {product.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`font-semibold text-gray-900 ${viewMode === 'list' ? 'text-lg' : 'text-sm'
                                  }`}>
                                  {product.price} {product.currency}
                                </p>
                                {product.stock && product.stock !== 'unlimited' && (
                                  <p className="text-xs text-gray-500">
                                    {product.stock} in stock
                                  </p>
                                )}
                              </div>

                              <button
                                onClick={() => handleAddToCart(product)}
                                className="flex gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                              >
                            <PackagePlus size={17}/>    Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {productsData && productsData.pagination.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Previous
                        </button>

                        <span className="px-4 py-2 text-sm text-gray-600">
                          Page {currentPage} of {productsData.pagination.totalPages}
                        </span>

                        <button
                          onClick={() => setCurrentPage(Math.min(productsData.pagination.totalPages, currentPage + 1))}
                          disabled={currentPage === productsData.pagination.totalPages}
                          className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  /* Empty State */
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchQuery || selectedCategory ? 'No products found' : 'No products yet'}
                    </h3>
                    <p className="text-gray-600 mb-4">
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
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
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
        <footer className="bg-white border-t border-gray-200 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Create your SolStore</span>
                </Link>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Powered by SolStore</span>
                  <span>•</span>
                  <span>Web3 Commerce</span>
                </div>
              </div>

              <div className="text-center md:text-right">
                <p className="text-sm text-gray-600 mb-1">© 2025 {storeData.name}</p>
                <p className="text-xs text-gray-500">
                  Owner: {storeData.owner.walletAddress.slice(0, 4)}...{storeData.owner.walletAddress.slice(-4)}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>

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

