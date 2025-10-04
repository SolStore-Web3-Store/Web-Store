"use client";
import React, { useState, Suspense } from 'react';
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
  XCircle
} from 'lucide-react';

const orders = [
  {
    id: '#ORD-001',
    customer: 'alice.sol',
    customerEmail: 'alice@example.com',
    product: 'Digital Art Collection #1',
    amount: '2.5 SOL',
    status: 'completed',
    date: '2024-10-01',
    time: '14:30',
    txHash: '5KJp7z8...'
  },
  {
    id: '#ORD-002',
    customer: 'bob.sol',
    customerEmail: 'bob@example.com',
    product: 'Web3 Development Kit',
    amount: '1.8 SOL',
    status: 'pending',
    date: '2024-10-02',
    time: '09:15',
    txHash: '3Hm9x2k...'
  },
  {
    id: '#ORD-003',
    customer: 'carol.sol',
    customerEmail: 'carol@example.com',
    product: 'NFT Minting Tools',
    amount: '5.0 SOL',
    status: 'processing',
    date: '2024-10-02',
    time: '16:45',
    txHash: '7Qw4n1p...'
  },
  {
    id: '#ORD-004',
    customer: 'dave.sol',
    customerEmail: 'dave@example.com',
    product: 'Smart Contract Template',
    amount: '3.2 SOL',
    status: 'failed',
    date: '2024-10-03',
    time: '11:20',
    txHash: '9Rt5m8x...'
  },
  {
    id: '#ORD-005',
    customer: 'eve.sol',
    customerEmail: 'eve@example.com',
    product: 'DeFi Analytics Dashboard',
    amount: '4.1 SOL',
    status: 'completed',
    date: '2024-10-03',
    time: '13:10',
    txHash: '2Bv6k9l...'
  }
];

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  processing: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
  failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
};

function OrdersContent() {
  const searchParams = useSearchParams();
  const currentStore = searchParams.get('store') || 'cryptoart-gallery';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentStore={currentStore} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600">Manage and track your store orders</p>
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
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Order ID</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Customer</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Product</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{order.id}</div>
                          <div className="text-sm text-gray-500">{order.txHash}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{order.customer}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{order.product}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-900">{order.amount}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status as keyof typeof statusConfig].bg} ${statusConfig[order.status as keyof typeof statusConfig].color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-gray-900">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{order.date}</span>
                          </div>
                          <div className="text-sm text-gray-500">{order.time}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
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