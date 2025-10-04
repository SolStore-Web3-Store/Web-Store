"use client";
import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/ui/sidebar';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Eye,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { storeApi, ApiError } from '@/lib/api';
import { useWallet } from '@/hooks/useWallet';
import { Loading } from '@/components/ui/loading';
import Link from 'next/link';

interface StoreData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  banner?: string;
  settings: Record<string, unknown>;
  owner: {
    walletAddress: string;
  };
}

interface AnalyticsData {
  revenue: {
    current: string;
    previous: string;
    currency: string;
    change: string;
  };
  orders: {
    current: number;
    previous: number;
    change: string;
  };
  products: {
    total: number;
    active: number;
    draft: number;
    inactive: number;
  };
  customers: {
    current: number;
    previous: number;
    change: string;
  };
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: string;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerWallet: string;
    productName: string;
    totalAmount: string;
    currency: string;
    status: string;
    createdAt: string;
  }>;
}

function StoreDashboardContent() {
  const { isConnected } = useWallet();
  const searchParams = useSearchParams();
  const currentStore = searchParams.get('store');
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load store analytics
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!isConnected || !currentStore) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get store data first to get the store ID
        const store = await storeApi.getStoreBySlug(currentStore);
        setStoreData({
          ...store,
          settings: store.settings as Record<string, unknown> || {}
        });

        // Get analytics data
        const analyticsData = await storeApi.getStoreAnalytics(store.id);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Error loading analytics:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load store analytics');
        }
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [isConnected, currentStore]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (change: string) => {
    if (change.startsWith('+')) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (change.startsWith('-')) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getTrendColor = (change: string) => {
    if (change.startsWith('+')) {
      return 'text-green-600';
    } else if (change.startsWith('-')) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  if (!isConnected) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please connect your wallet to access the store dashboard.</p>
        </div>
      </div>
    );
  }

  if (!currentStore) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Store Selected</h2>
          <p className="text-gray-600 mb-4">Please select a store from the sidebar to view its dashboard.</p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View All Stores
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentStore={currentStore} />
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentStore={currentStore} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {storeData?.name || currentStore} Dashboard
              </h1>
              <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
              {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/${currentStore}`}
                target="_blank"
                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Store
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {analytics ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics.revenue.current} {analytics.revenue.currency}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {getTrendIcon(analytics.revenue.change)}
                        <span className={`text-sm ${getTrendColor(analytics.revenue.change)}`}>
                          {analytics.revenue.change}
                        </span>
                      </div>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.orders.current}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getTrendIcon(analytics.orders.change)}
                        <span className={`text-sm ${getTrendColor(analytics.orders.change)}`}>
                          {analytics.orders.change}
                        </span>
                      </div>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Products</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.products.total}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm text-gray-600">
                          {analytics.products.active} active, {analytics.products.draft} draft
                        </span>
                      </div>
                    </div>
                    <Package className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Customers</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.customers.current}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getTrendIcon(analytics.customers.change)}
                        <span className={`text-sm ${getTrendColor(analytics.customers.change)}`}>
                          {analytics.customers.change}
                        </span>
                      </div>
                    </div>
                    <Users className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
              <p className="text-gray-600">Unable to load store analytics at this time.</p>
            </div>
          )}

          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                    <Link
                      href={`/admin/store/orders?store=${currentStore}`}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View All
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {analytics.recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-gray-900">{order.orderNumber}</p>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{order.customerWallet}</p>
                            <p className="text-sm text-gray-500">{order.productName}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-semibold text-gray-900">
                              {order.totalAmount} {order.currency}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No recent orders</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                    <Link
                      href={`/admin/store/products?store=${currentStore}`}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View All
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {analytics.topProducts.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.topProducts.map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-indigo-600">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.sales} sales</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{product.revenue} SOL</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No products yet</p>
                      <Link
                        href={`/admin/store/products?store=${currentStore}`}
                        className="inline-flex items-center gap-2 mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        <Package className="w-4 h-4" />
                        Add your first product
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="hidden mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Package className="w-6 h-6 text-indigo-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Add Product</p>
                  <p className="text-sm text-gray-500">Create a new product listing</p>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ShoppingCart className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Process Orders</p>
                  <p className="text-sm text-gray-500">Manage pending orders</p>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">View Analytics</p>
                  <p className="text-sm text-gray-500">Check store performance</p>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function StoreDashboard() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    }>
      <StoreDashboardContent />
    </Suspense>
  );
}