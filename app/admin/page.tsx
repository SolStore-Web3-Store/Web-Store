"use client";
import React from 'react';
import { Store, TrendingUp, Package, Users, ArrowRight, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const demoStores = [
    {
        id: 1,
        name: "CryptoArt Gallery",
        slug: "cryptoart-gallery",
        description: "Digital art and NFT marketplace for creators",
        revenue: "12.5 SOL",
        orders: 47,
        products: 23,
        status: "active",
        icon: "🎨",
        color: "bg-purple-500"
    },
    {
        id: 2,
        name: "Web3 Tools Store",
        slug: "web3-tools",
        description: "Essential tools and resources for Web3 developers",
        revenue: "8.3 SOL",
        orders: 32,
        products: 15,
        status: "active",
        icon: "🛠️",
        color: "bg-blue-500"
    }
];

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <Image src={'/solStore_icon.png'}
                                                height={80}
                                                width={80}
                                                alt='SolStore_Logo'/>
                            <span className="text-sm text-gray-500 ml-2">Admin Panel</span>
                        </div>
                        <Link
                            href="/onboard"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Create New Store
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Stores</h1>
                    <p className="text-gray-600">Manage and monitor your Web3 stores</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Stores</p>
                                <p className="text-2xl font-bold text-gray-900">2</p>
                            </div>
                            <Store className="w-8 h-8 text-indigo-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">20.8 SOL</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">79</p>
                            </div>
                            <Package className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">38</p>
                            </div>
                            <Users className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Stores Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {demoStores.map((store) => (
                        <div key={store.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Store Header */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 ${store.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                                            {store.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                                            <p className="text-sm text-gray-500">/{store.slug}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {store.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mt-3">{store.description}</p>
                            </div>

                            {/* Store Stats */}
                            <div className="p-6">
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900">{store.revenue}</p>
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

                {/* Empty State for More Stores */}
                <div className="mt-8 bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Create Another Store</h3>
                    <p className="text-gray-600 mb-4">Expand your Web3 business with multiple stores</p>
                    <Link
                        href="/onboard"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <Store className="w-4 h-4" />
                        Create New Store
                    </Link>
                </div>
            </main>
        </div>
    );
}