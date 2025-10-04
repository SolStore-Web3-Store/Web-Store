"use client"
import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingCart, Home, Share2, Globe, ChevronDown, ChevronUp } from 'lucide-react';


interface StoreType {
  params: Promise<{
    storeSlug: string
  }>
}

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

// Main Page Component
export default function Store(storeName: StoreType) {
  const [storeSlug, setStoreSlug] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    storeName?.params.then((params) => {
      setStoreSlug(params.storeSlug);
    });
  }, [storeName?.params]);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);
  const [isFilterCategoryExpanded, setIsFilterCategoryExpanded] = useState(true);
  const [selectedLanguage] = useState('English');
  const [sortBy, setSortBy] = useState('Latest');

  const products: Product[] = [
    {
      id: '1',
      name: 'New iPhone',
      price: 5000.00,
    },
  ];

  return (
    <div className="flex h-full w-full bg-white">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
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
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1" />
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Hero Section with Profile */}
        <section className="bg-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                {/* Placeholder for profile image */}
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
              </div>
            </div>

            {/* Store Name */}
            <h1 className="text-4xl font-bold text-gray-900 mb-8">{storeSlug}</h1>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-center gap-8 text-sm">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button className="flex items-center gap-2 text-gray-900 font-medium border-b-2 border-gray-900 pb-1">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-gray-50 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="lg:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  <option>Latest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="flex-1 bg-white py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-64 space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <button
                    onClick={() => setIsFilterCategoryExpanded(!isFilterCategoryExpanded)}
                    className="flex items-center justify-between w-full text-sm font-medium text-gray-900"
                  >
                    <span>Category</span>
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
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span>Products</span>
                      </label>
                    </div>
                  )}
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <ShoppingCart className="w-16 h-16 text-gray-400" />
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ₦{product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <ShoppingCart className="w-4 h-4" />
                <span>Create your Take App</span>
              </button>
              <p className="text-xs text-gray-500">© 2025 {storeSlug}</p>
            </div>
          </div>
        </footer>
      </main>

      {/* Windows Activation Watermark */}
      <div className="fixed bottom-4 right-4 text-right pointer-events-none">
        <p className="text-gray-300 text-sm font-light">Activate Windows</p>
        <p className="text-gray-300 text-xs">Go to Settings to activate Windows.</p>
      </div>
    </div>
  );
}

