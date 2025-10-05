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
    total: string;
    currency: string;
    change: string;
  };
  orders: {
    total: number;
    change: string;
  };
  products: {
    total: number;
    active: number;
    draft: number;
  };
  customers: {
    total: number;
    change: string;
  };
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: string;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    product: string;
    amount: string;
    status: string;
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
  const [refreshing, setRefreshing] = useState(false);


  // Load store analytics function
  const loadAnalytics = async (isRefresh = false) => {
      if (!isConnected || !currentStore) {
        setLoading(false);
        return;
      }

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        // Get store data first to get the store ID
        const store = await storeApi.getStoreBySlug(currentStore);
        setStoreData({
          ...store,
          settings: store.settings as Record<string, unknown> || {}
        });

        // Try to get analytics from the dedicated endpoint first
        let analyticsData;
        try {
          console.log('Attempting to fetch analytics from API endpoint...');
          const rawAnalytics = await storeApi.getStoreAnalytics(store.id);
          console.log('Analytics data received from API:', rawAnalytics);
          
          // Transform the API response to match our interface
          analyticsData = {
            revenue: {
              total: rawAnalytics.revenue?.total || '0',
              currency: rawAnalytics.revenue?.currency || 'SOL',
              change: rawAnalytics.revenue?.change || '0%'
            },
            orders: {
              total: rawAnalytics.orders?.total || 0,
              change: rawAnalytics.orders?.change || '0%'
            },
            products: {
              total: rawAnalytics.products?.total || 0,
              active: rawAnalytics.products?.active || 0,
              draft: rawAnalytics.products?.draft || 0
            },
            customers: {
              total: rawAnalytics.customers?.total || 0,
              change: rawAnalytics.customers?.change || '0%'
            },
            topProducts: rawAnalytics.topProducts?.map(product => ({
              name: product.name,
              sales: product.sales,
              revenue: product.revenue
            })) || [],
            recentOrders: rawAnalytics.recentOrders?.map(order => ({
              id: order.id,
              customer: order.customer,
              product: order.product,
              amount: order.amount,
              status: order.status
            })) || []
          };
          
          console.log('Transformed analytics data:', analyticsData);
          setAnalytics(analyticsData);
        } catch (analyticsError) {
          console.log('Analytics endpoint not available, calculating from raw data...', analyticsError);
          
          // Fallback: Calculate analytics from orders and products
          console.log('Fetching orders and products for analytics calculation...');
          const [orders, products] = await Promise.all([
            storeApi.getStoreOrders(store.id, { limit: 100 }),
            storeApi.getStoreProducts(store.id, { limit: 100 })
          ]);
          
          console.log('Orders data:', orders);
          console.log('Products data:', products);

          // Calculate revenue from completed orders
          const completedOrders = orders.orders.filter(order => order.status === 'completed');
          const totalRevenue = completedOrders.reduce((sum, order) => {
            return sum + parseFloat(order.totalAmount);
          }, 0);

          // Calculate recent orders (last 5)
          const recentOrders = orders.orders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map(order => ({
              id: order.id,
              orderNumber: order.orderNumber,
              customerWallet: order.customer.wallet,
              productName: order.product.name,
              totalAmount: order.totalAmount,
              currency: order.currency,
              status: order.status,
              createdAt: order.createdAt
            }));

          // Calculate top products by sales
          const productSales = new Map<string, { product: unknown; sales: number; revenue: number }>();
          
          completedOrders.forEach(order => {
            const productId = order.product.id;
            const existing = productSales.get(productId) || { 
              product: order.product, 
              sales: 0, 
              revenue: 0 
            };
            
            existing.sales += order.quantity;
            existing.revenue += parseFloat(order.totalAmount);
            productSales.set(productId, existing);
          });

          const topProducts = Array.from(productSales.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map(item => ({
              id: item.product.id,
              name: item.product.name,
              sales: item.sales,
              revenue: item.revenue.toFixed(4)
            }));

          // Count unique customers
          const uniqueCustomers = new Set(completedOrders.map(order => order.customer.wallet)).size;

          // Calculate product stats
          const activeProducts = products.products.filter(p => p.status === 'active').length;
          const draftProducts = products.products.filter(p => p.status === 'draft').length;
          const inactiveProducts = products.products.filter(p => p.status === 'inactive').length;

          // Set calculated analytics data
          const calculatedAnalytics = {
            revenue: {
              total: totalRevenue.toFixed(4),
              currency: 'SOL',
              change: totalRevenue > 0 ? `+${((totalRevenue / Math.max(1, totalRevenue)) * 100).toFixed(1)}%` : '0%'
            },
            orders: {
              total: orders.orders.length,
              change: orders.orders.length > 0 ? `+${orders.orders.length}` : '0'
            },
            products: {
              total: products.products.length,
              active: activeProducts,
              draft: draftProducts
            },
            customers: {
              total: uniqueCustomers,
              change: uniqueCustomers > 0 ? `+${uniqueCustomers}` : '0'
            },
            topProducts,
            recentOrders: recentOrders.map(order => ({
              id: order.orderNumber,
              customer: order.customerWallet,
              product: order.productName,
              amount: order.totalAmount,
              status: order.status
            }))
          };
          
          console.log('Calculated analytics:', calculatedAnalytics);
          setAnalytics(calculatedAnalytics);
        }

      } catch (err) {
        console.error('Error loading analytics:', err);
        if (err instanceof ApiError) {
          setError(`${err.message} (Code: ${err.code})`);
        } else {
          setError('Failed to load store analytics');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  // Load analytics on component mount
  useEffect(() => {
    loadAnalytics();
  }, [isConnected, currentStore]);

  // Refresh function
  const handleRefresh = () => {
    loadAnalytics(true);
  };

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
              <p className="text-gray-600">
                Welcome back! Here&apos;s what&apos;s happening with your store.
                {analytics && !loading && !error && (
                  <span className="ml-2 text-green-600 text-sm">
                    ✓ Data updated
                  </span>
                )}
              </p>
              {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-700">
                    <p className="font-medium">Error loading analytics:</p>
                    <p>{error}</p>
                    <button 
                      onClick={handleRefresh}
                      className="mt-2 text-red-600 hover:text-red-800 underline text-xs"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}

            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                title="Refresh analytics data"
              >
                <TrendingUp className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
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
          {refreshing && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
              <TrendingUp className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-blue-700">Refreshing analytics data...</span>
            </div>
          )}
          
          {analytics ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {analytics.revenue?.total || '0'} {analytics.revenue?.currency || 'SOL'}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {analytics.revenue?.change && getTrendIcon(analytics.revenue.change)}
                        <span className={`text-sm ${analytics.revenue?.change ? getTrendColor(analytics.revenue.change) : 'text-gray-600'}`}>
                          {analytics.revenue?.change || 'No change'}
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
                      <p className="text-2xl font-bold text-gray-900">{analytics.orders?.total || 0}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {analytics.orders?.change && getTrendIcon(analytics.orders.change)}
                        <span className={`text-sm ${analytics.orders?.change ? getTrendColor(analytics.orders.change) : 'text-gray-600'}`}>
                          {analytics.orders?.change || 'No change'}
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
                      <p className="text-2xl font-bold text-gray-900">{analytics.products?.total || 0}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm text-gray-600">
                          {analytics.products?.active || 0} active, {analytics.products?.draft || 0} draft
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
                      <p className="text-2xl font-bold text-gray-900">{analytics.customers?.total || 0}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {analytics.customers?.change && getTrendIcon(analytics.customers.change)}
                        <span className={`text-sm ${analytics.customers?.change ? getTrendColor(analytics.customers.change) : 'text-gray-600'}`}>
                          {analytics.customers?.change || 'No change'}
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
              <p className="text-gray-600 mb-4">Unable to load store analytics at this time.</p>
              
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3 max-w-md mx-auto mb-4">
                  <strong>Error:</strong> {error}
                </div>
              )}
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
                  {analytics.recentOrders && analytics.recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.recentOrders.map((order, index) => (
                        <div key={order.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-gray-900">{order.id || 'N/A'}</p>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || 'pending')}`}>
                                {order.status || 'pending'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600" title={order.customer}>
                              {order.customer ? 
                                `${order.customer.slice(0, 8)}...${order.customer.slice(-4)}` : 
                                'Unknown wallet'
                              }
                            </p>
                            <p className="text-sm text-gray-500">{order.product || 'Unknown product'}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-semibold text-gray-900">
                              {order.amount || '0'} SOL
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">No recent orders</p>
                      <p className="text-sm text-gray-500">Orders will appear here once customers start purchasing</p>
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
                  {analytics.topProducts && analytics.topProducts.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.topProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-indigo-600">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name || 'Unknown product'}</p>
                              <p className="text-sm text-gray-500">{product.sales || 0} sales</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{product.revenue || '0'} SOL</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">No products yet</p>
                      <p className="text-sm text-gray-500 mb-4">Create products to start selling and see analytics</p>
                      <Link
                        href={`/admin/store/products?store=${currentStore}`}
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
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