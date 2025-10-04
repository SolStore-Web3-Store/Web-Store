"use client";
import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/ui/sidebar';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit,
  Trash2,
  MoreHorizontal,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Digital Art Collection #1',
    description: 'Exclusive digital art pieces with blockchain verification',
    price: '2.5 SOL',
    sales: 23,
    revenue: '57.5 SOL',
    status: 'active',
    category: 'Digital Art',
    stock: 'Unlimited',
    image: '🎨',
    trend: 'up'
  },
  {
    id: 2,
    name: 'Web3 Development Kit',
    description: 'Complete toolkit for Web3 application development',
    price: '1.8 SOL',
    sales: 18,
    revenue: '32.4 SOL',
    status: 'active',
    category: 'Tools',
    stock: '50',
    image: '🛠️',
    trend: 'up'
  },
  {
    id: 3,
    name: 'NFT Minting Tools',
    description: 'Easy-to-use tools for creating and minting NFTs',
    price: '5.0 SOL',
    sales: 12,
    revenue: '60.0 SOL',
    status: 'active',
    category: 'Tools',
    stock: 'Unlimited',
    image: '🎯',
    trend: 'down'
  },
  {
    id: 4,
    name: 'Smart Contract Template',
    description: 'Pre-built smart contract templates for common use cases',
    price: '3.2 SOL',
    sales: 8,
    revenue: '25.6 SOL',
    status: 'draft',
    category: 'Templates',
    stock: 'Unlimited',
    image: '📄',
    trend: 'up'
  },
  {
    id: 5,
    name: 'DeFi Analytics Dashboard',
    description: 'Comprehensive analytics dashboard for DeFi protocols',
    price: '4.1 SOL',
    sales: 15,
    revenue: '61.5 SOL',
    status: 'active',
    category: 'Analytics',
    stock: '25',
    image: '📊',
    trend: 'up'
  }
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const currentStore = searchParams.get('store') || 'cryptoart-gallery';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentStore={currentStore} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600">Manage your store&apos;s product catalog</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Package className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">237.0 SOL</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Active Products</p>
                <p className="text-xl font-bold text-gray-900">{products.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Edit className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Draft Products</p>
                <p className="text-xl font-bold text-gray-900">{products.filter(p => p.status === 'draft').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="Digital Art">Digital Art</option>
              <option value="Tools">Tools</option>
              <option value="Templates">Templates</option>
              <option value="Analytics">Analytics</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {product.image}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Category: {product.category}</span>
                    <span className="text-gray-500">Stock: {product.stock}</span>
                  </div>
                </div>

                {/* Product Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{product.price}</p>
                      <p className="text-xs text-gray-500">Price</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-lg font-bold text-gray-900">{product.sales}</p>
                        {product.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Sales</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{product.revenue}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto">
                <Plus className="w-4 h-4" />
                Add Your First Product
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}