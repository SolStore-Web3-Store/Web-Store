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
    const [isMounted, setisMounted] =useState(false)
    const [stores, setStores] = useState<StoreData[]>([]);
    const [stats, setStats] = useState<StoreStats>({
        totalStores: 0,
        totalRevenue: '0',
        totalOrders: 0,
        totalProducts: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
   // const [backendAvailable, //setBackendAvailable] = useState<boolean | null>(null);

    // Check backend availability and load stores
    useEffect(() => {
        setisMounted(true)
        
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Check if backend is available
             

                // If wallet is connected, load real data
                if (isConnected) {
                    await loadStoresFromAPI();
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load store data. Please check your backend server.');
                ///setBackendAvailable(false);
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
                    //setBackendAvailable(false);
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
            <div className={`w-12 h-12 ${colors[colorIndex]} rounded-lg flex items-center justify-center text-white text-sm`}>
                {emoji}
            </div>
        );
    };
    if (loading || !isMounted) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loading />
          </div>
        )}
        else{
             return (
        <div className="flex flex-col h-full w-full bg-gray-50 text-black">
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
                                <span className="text-xs text-gray-500">Admin Panel</span>

                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                          
                                
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
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
                            
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-col  items-center justify-center w-full px-4 py-8">
              
                
                        {
                            stores.length > 0 && (
                                <div className="flex flex-col max-w-2xl w-full gap-6">
                                    {stores.map((store) => (
                                        <div key={store.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                            {/* Store Header */}
                                            <div className="p-6 border-b border-gray-100">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {getStoreIcon(store)}
                                                        <div>
                                                            <h3 className="text-xs font-semibold text-gray-900">{store.name}</h3>
                                                            <p className="text-xs text-gray-500">/{store.slug}</p>
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
                                            <div className=" p-6">
                                                <div className="hidden grid grid-cols-3 gap-4 mb-6">
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-gray-900">{store.revenue} SOL</p>
                                                        <p className="text-xs text-gray-500">Revenue</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-gray-900">{store.orders}</p>
                                                        <p className="text-xs text-gray-500">Orders</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold text-gray-900">{store.products}</p>
                                                        <p className="text-xs text-gray-500">Products</p>
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
                         
 ) }

                  
                 

            </main>
        </div>
    );
        }
  

   
}