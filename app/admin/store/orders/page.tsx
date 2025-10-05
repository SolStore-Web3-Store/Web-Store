"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/ui/sidebar';
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
  Package
} from 'lucide-react';
import { storeApi, ApiError } from '@/lib/api';
import { useWallet } from '@/hooks/useWallet';
import { Loading } from '@/components/ui/loading';

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

interface Order {
  id: string;
  orderId: string; // Changed from orderNumber to match API response
  customer: {
    wallet: string;
    email?: string;
  };
  product: {
    id: string;
    name: string;
  };
  amount: string; // Changed from totalAmount to match API response
  currency: string;
  status: string;
  paymentTxHash?: string | null;
  createdAt: string;
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  processing: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
  failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  cancelled: { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-100' }
};

function OrdersContent() {
  const { isConnected } = useWallet();
  const searchParams = useSearchParams();
  const currentStore = searchParams.get('store');

  const [orders, setOrders] = useState<OrdersResponse | null>(null);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Load store data and orders
  useEffect(() => {
    const loadData = async () => {
      if (!isConnected || !currentStore) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get store data first
        const store = await storeApi.getStoreBySlug(currentStore);
        setStoreData({
          ...store,
          settings: store.settings as Record<string, unknown> || {}
        });

        // Get orders
        const ordersData = await storeApi.getStoreOrders(store.id, {
          page: currentPage,
          limit: 20,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchTerm || undefined,
        });

        setOrders(ordersData);
      } catch (err) {
        console.error('Error loading orders:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load orders');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isConnected, currentStore, currentPage, statusFilter, searchTerm]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (!storeData) return;

    try {
      await storeApi.updateOrderStatus(storeData.id, orderId, { status: newStatus });

      // Refresh orders
      const ordersData = await storeApi.getStoreOrders(storeData.id, {
        page: currentPage,
        limit: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined,
      });
      setOrders(ordersData);
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please connect your wallet to access orders.</p>
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
          <p className="text-gray-600">Please select a store to view orders.</p>
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
    <div className="flex h-screen bg-gray-50 text-black">
      <Sidebar currentStore={currentStore} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600">
                Manage and track orders for {storeData?.name || currentStore}
              </p>
              {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </header>

        {/* Filters and Search */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, customers, or products..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 w-48">Order ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 w-64">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 w-48">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 w-32">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 w-40">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 w-40">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 w-32">Transaction</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders && orders.orders.length > 0 ? (
                    orders.orders.map((order) => {
                      const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || AlertCircle;
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900 text-sm">{order.orderId}</div>
                            <div className="text-xs text-gray-500">ID: {order.id.slice(0, 8)}...</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900 text-sm break-all">
                              {order.customer.wallet.slice(0, 8)}...{order.customer.wallet.slice(-4)}
                            </div>
                            {order.customer.email && (
                              <div className="text-xs text-gray-500 break-all">{order.customer.email}</div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900 text-sm">{order.product.name}</div>
                            <div className="text-xs text-gray-500">ID: {order.product.id.slice(0, 8)}...</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-gray-900 text-sm">
                              {order.amount} {order.currency}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <StatusIcon className={`w-4 h-4 ${statusConfig[order.status as keyof typeof statusConfig]?.color || 'text-gray-600'}`} />
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusConfig[order.status as keyof typeof statusConfig]?.bg || 'bg-gray-100'} ${statusConfig[order.status as keyof typeof statusConfig]?.color || 'text-gray-600'}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1 text-gray-900">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-xs">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {order.paymentTxHash ? (
                              <a
                                href={`https://explorer.solana.com/tx/${order.paymentTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                              >
                                {order.paymentTxHash.slice(0, 6)}...
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">No transaction</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1">
                              <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                        <p className="text-gray-600">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'Try adjusting your search or filters.' 
                            : 'Orders will appear here when customers make purchases.'
                          }
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {orders && orders.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {orders.orders.length} of {orders.pagination.total} orders
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} of {orders.pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(orders.pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === orders.pagination.totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {orders && orders.orders.length === 0 && (
            <div className="text-center text-sm text-gray-500 mt-6">
              No orders match your current filters.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}