"use client";
import React, { useState, useEffect } from 'react';
import { Store, TrendingUp, Package, Users, ArrowRight, Eye, Plus, AlertCircle, Wallet } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { storeApi, ApiError } from '@/lib/api';
import { useWallet } from '@/hooks/useWallet';
import { WalletConnectButton } from '@/components/wallet/wallet-connect-button';
import { Loading } from '@/components/ui/loading';

interface StoreData {
    id: string;
    name: string;
    slug: string;
    description?: string;
    revenue: string;
    orders: number;
    products: number;
    status: string;
    icon?: string;
    createdAt: string;
}

interface StoreStats {
    totalStores: number;
    totalRevenue: string;
    totalOrders: number;
    totalProducts: number;
}

export default function AdminPage() {
    const { isConnected, walletAddress } = useWallet();
    const [stores, setStores] = useState<StoreData[]>([]);
    const [stats, setStats] = useState<StoreStats>({
        totalStores: 0,
        totalRevenue: '0',
        totalOrders: 0,
        totalProducts: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

    // Check backend availability and load stores
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Check if backend is available
                const isBackendUp = true;
                setBackendAvailable(isBackendUp);

                if (!isBackendUp) {
                    setError('Backend server is not available. Please start your backend server.');
                    setLoading(false);
                    return;
                }

                // If wallet is connected, load real data
                if (isConnected) {
                    await loadStoresFromAPI();
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load store data. Please check your backend server.');
                setBackendAvailable(false);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isConnected]);

    const loadStoresFromAPI = async () => {
        try {
            const userStores = await storeApi.getUserStores();
            setStores(userStores);

            // Calculate stats
            const totalRevenue = userStores.reduce((sum: number, store: StoreData) => sum + parseFloat(store.revenue || '0'), 0);
            const totalOrders = userStores.reduce((sum: number, store: StoreData) => sum + (store.orders || 0), 0);
            const totalProducts = userStores.reduce((sum: number, store: StoreData) => sum + (store.products || 0), 0);

            setStats({
                totalStores: userStores.length,
                totalRevenue: totalRevenue.toFixed(1),
                totalOrders,
                totalProducts
            });
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
                if (err.code === 'NETWORK_ERROR') {
                    setBackendAvailable(false);
                }
            } else {
                setError('Failed to load stores');
            }
            throw err;
        }
    };



    const getStoreIcon = (store: StoreData) => {
        if (store.icon && store.icon.startsWith('http')) {
            return (
                <Image
                    src={store.icon}
                    alt={store.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg object-cover"
                />
            );
        }

        // Fallback to emoji or default
        const emoji = store.icon || '🏪';
        const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500'];
        const colorIndex = store.name.length % colors.length;

        return (
            <div className={`w-12 h-12 ${colors[colorIndex]} rounded-lg flex items-center justify-center text-white text-xl`}>
                {emoji}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Image
                                src="/solStore_icon.png"
                                height={80}
                                width={80}
                                alt="SolStore_Logo"
                            />
                            <div>
                                <span className="text-sm text-gray-500">Admin Panel</span>

                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {!isConnected ? (
                                <WalletConnectButton />
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Wallet className="w-4 h-4" />
                                        <span className="font-mono">
                                            {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
                                        </span>
                                    </div>
                                    <Link
                                        href="/onboard"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Create New Store
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {!isConnected ? (
                    // Wallet Connection Required
                    <div className="text-center py-16">
                        <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Connect Your Wallet</h1>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Connect your Solana wallet to view and manage your stores. Your wallet serves as your secure login.
                        </p>
                        <WalletConnectButton />
                    </div>
                ) : (
                    <>
                        {/* Page Title */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Stores</h1>
                            <p className="text-gray-600">Manage and monitor your Web3 stores</p>
                            {error && (
                                <div className="mt-4 p-4 border rounded-lg bg-red-50 border-red-200">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                        <span className="font-medium text-red-700">Error</span>
                                    </div>
                                    <p className="mt-1 text-red-700">{error}</p>
                                    {error.includes('Backend server') && (
                                        <div className="mt-2 text-sm text-red-600">
                                            <p>To fix this:</p>
                                            <ul className="list-disc list-inside ml-2 space-y-1">
                                                <li>Start your backend server: <code className="bg-red-100 px-1 rounded">npm run dev</code></li>
                                                <li>Ensure it&apos;s running on the correct port</li>
                                                <li>Check your network connection</li>
                                            </ul>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>

                        {/* Stats Overview */}
                        {backendAvailable !== false && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Stores</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalStores}</p>
                                        </div>
                                        <Store className="w-8 h-8 text-indigo-600" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Revenue</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue} SOL</p>
                                        </div>
                                        <TrendingUp className="w-8 h-8 text-green-600" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Orders</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                                        </div>
                                        <Package className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-6 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Total Products</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                                        </div>
                                        <Users className="w-8 h-8 text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stores Grid */}
                        {backendAvailable !== false ? (
                            stores.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {stores.map((store) => (
                                        <div key={store.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                            {/* Store Header */}
                                            <div className="p-6 border-b border-gray-100">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {getStoreIcon(store)}
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                                                            <p className="text-sm text-gray-500">/{store.slug}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${store.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {store.status}
                                                    </span>
                                                </div>
                                                {store.description && (
                                                    <p className="text-gray-600 mt-3">{store.description}</p>
                                                )}
                                            </div>

                                            {/* Store Stats */}
                                            <div className="p-6">
                                                <div className="grid grid-cols-3 gap-4 mb-6">
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-gray-900">{store.revenue} SOL</p>
                                                        <p className="text-sm text-gray-500">Revenue</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-gray-900">{store.orders}</p>
                                                        <p className="text-sm text-gray-500">Orders</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-gray-900">{store.products}</p>
                                                        <p className="text-sm text-gray-500">Products</p>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-3">
                                                    <Link
                                                        href={`/admin/store?store=${store.slug}`}
                                                        className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        Manage Store
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/${store.slug}`}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // Empty State - No Stores
                                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                                    <Store className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Stores Yet</h3>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        Get started by creating your first Web3 store. It only takes a few minutes to set up.
                                    </p>
                                    <Link
                                        href="/onboard"
                                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Create Your First Store
                                    </Link>
                                </div>
                            )
                        ) : null}

                        {/* Create Another Store CTA */}
                        {backendAvailable !== false && stores.length > 0 && (
                            <div className="mt-8 bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                                <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Create Another Store</h3>
                                <p className="text-gray-600 mb-4">Expand your Web3 business with multiple stores</p>
                                <Link
                                    href="/onboard"
                                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create New Store
                                </Link>
                            </div>
                        )}

                        {/* Backend Unavailable State */}
                        {backendAvailable === false && (
                            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                                <h3 className="text-xl font-medium text-gray-900 mb-2">Backend Server Required</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Your wallet is connected, but the backend server is not available.
                                    Please start your backend server to view and manage your stores.
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                                    <p className="text-sm text-gray-700 font-medium mb-2">To start the backend:</p>
                                    <code className="text-sm bg-gray-800 text-green-400 px-3 py-2 rounded block">
                                        npm run dev
                                    </code>
                                    <p className="text-xs text-gray-500 mt-2">Run this command in your backend folder</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}