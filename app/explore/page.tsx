"use client"
import React from 'react';
import { Flame, User, LogOut, ArrowRight, Search, Filter, Star, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { WalletService } from '@/lib/wallet';

export default function ExplorePage() {
  const { isConnected, walletAddress, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const walletService = WalletService.getInstance();
  const authToken = typeof window !== 'undefined' ? walletService.getAuthToken() : null;

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleWalletAction = async () => {
    if (isConnected) {
      await disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  const stores = [
    {
      id: 1,
      name: "Prudence Stores",
      description: "We offer affordable smartphones and at an affordable rate",
      image: "/solstoreDash.jpg",
      category: "Art & Design",
      rating: 4.8,
      products: 24,
      url: '/prudence'
    },
    {
      id: 2,
      name: "Peter Stores",
      description: "Essential tools and resources for Web3 developers",
      image: "/solstoreDash.jpg",
      category: "Development",
      rating: 4.9,
      products: 18,
      url: '/my-store'

    },
    {
      id: 3,
      name: "BYCrypto Stores",
      description: "Buy Crypto Courses",
      image: "/solstoreDash.jpg",
      category: "Education",
      rating: 4.7,
      products: 12,
      url: '/bycrypto'
    }
  ];

  return (
    <div className="h-full w-full bg-gray-50 text-black" suppressHydrationWarning>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 px-4 text-center text-xs font-medium">
        <span className="inline-flex items-center gap-2">
          <Flame className="w-4 h-4 text-yellow-400" />
          <span>
            <strong>Discover amazing Web3 stores!</strong> Explore digital products from creators worldwide.
          </span>
        </span>
      </div>

      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-700">
        <div className="w-full mx-auto px-8 sm:px-16 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src={'/solStore_icon.png'}
              height={80}
              width={80}
              alt='SolStore_Logo' />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-8">
            <Link href="/explore" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Explore
            </Link>
            <Link href="/features" className="text-gray-700 hover:text-gray-900 font-medium">
              Features
            </Link>
            <Link href="/howitworks" className="text-gray-700 hover:text-gray-900 font-medium">
              How it works?
            </Link>
          </nav>

          {/* Wallet & CTA Section */}
          <div className="flex items-center gap-4">
            {isConnected && walletAddress ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">
                    {formatWalletAddress(walletAddress)}
                  </span>
                </div>
                {authToken && (
                  <Link
                    href="/admin"
                    target='_blank'
                    className="flex gap-1 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <ArrowRight />
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleWalletAction}
                  className="flex items-center gap-2 px-3 py-2.5 text-gray-600 hover:text-gray-800 transition-colors"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleWalletAction}
                  disabled={isConnecting}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <div>Login in</div>
                  )}
                </button>
                <Link href='/onboard' className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto px-8 sm:px-16 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Explore Web3 Stores
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing digital products, NFTs, and services from creators around the world
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search stores, products, or creators..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative bg-gray-800">

              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">{store.name}</h3>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">{store.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded">{store.category}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{store.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{store.products} products</span>
                  <a href={store.url} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Visit Store
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-300">
            Load More Stores
          </button>
        </div>
      </main>
    </div>
  );
}