'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowLeft, Download, Mail } from 'lucide-react';
import { storeApi } from '@/lib/api';

export default function PaymentSuccessPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const storeSlug = params.storeSlug as string;
    
    const [orderData, setOrderData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const orderId = searchParams.get('orderId');
    const orderNumber = searchParams.get('orderNumber');

    useEffect(() => {
        if (orderId) {
            loadOrderData();
        } else {
            setLoading(false);
        }
    }, [orderId]);

    const loadOrderData = async () => {
        try {
            // In a real implementation, you'd fetch the order details
            // For now, we'll show a generic success message
            setOrderData({
                orderNumber: orderNumber || '#ORD-' + Date.now(),
                status: 'completed',
                message: 'Your order has been successfully processed!'
            });
        } catch (err) {
            console.error('Failed to load order data:', err);
            setError('Failed to load order information');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Order</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => router.push(`/${storeSlug}`)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Return to Store
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-md mx-auto bg-white min-h-screen border-x border-gray-400">
                {/* Header */}
                <header className="p-4 border-b border-gray-200 bg-white">
                    <button
                        onClick={() => router.push(`/${storeSlug}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm">Back to Store</span>
                    </button>
                </header>

                <main className="p-6 text-center">
                    {/* Success Icon */}
                    <div className="mb-6">
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                        <p className="text-gray-600">
                            Thank you for your purchase. Your order has been confirmed.
                        </p>
                    </div>

                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order Number:</span>
                                <span className="font-medium text-gray-900">
                                    {orderData?.orderNumber || '#ORD-' + Date.now()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="font-medium text-green-600 capitalize">
                                    {orderData?.status || 'Completed'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium text-gray-900">
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            What's Next?
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-2">
                            <li>• You'll receive a confirmation email shortly</li>
                            <li>• Download links will be sent to your email</li>
                            <li>• Keep your order number for future reference</li>
                            <li>• Contact support if you have any questions</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push(`/${storeSlug}`)}
                            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Continue Shopping
                        </button>
                        
                        <button
                            onClick={() => window.print()}
                            className="w-full h-12 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                        >
                            Print Receipt
                        </button>
                    </div>

                    {/* Support Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                            Need help? Contact support with your order number
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}