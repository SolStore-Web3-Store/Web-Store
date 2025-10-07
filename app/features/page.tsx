"use client"
import React from 'react';
import { Flame, User, LogOut, ArrowRight, Shield, Zap, Globe, Wallet, Code, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { WalletService } from '@/lib/wallet';

export default function FeaturesPage() {
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

  const features = [
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Built on Solana blockchain for maximum security and transparency. All transactions are immutable and verifiable."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience instant transactions with minimal fees. Solana's high-performance blockchain ensures quick processing."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Sell to customers worldwide without traditional payment barriers. Accept crypto payments from anywhere."
    },
    {
      icon: Wallet,
      title: "Wallet Integration",
      description: "Seamless integration with popular Solana wallets. Connect and start selling in minutes."
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Open-source platform with comprehensive APIs. Build custom integrations and extend functionality."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track sales, monitor performance, and gain insights with our comprehensive analytics tools."
    }
  ];

  return (
    <div className="h-full w-full bg-gray-50" suppressHydrationWarning>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 px-4 text-center text-xs font-medium">
        <span className="inline-flex items-center gap-2">
          <Flame className="w-4 h-4 text-yellow-400" />
          <span>
            <strong>Powerful Web3 Features!</strong> Discover what makes SolStore the best ecommerce platform for creators.
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
            <Link href="/explore" className="text-gray-700 hover:text-gray-900 font-medium">
              Explore
            </Link>
            <Link href="/features" className="text-indigo-600 hover:text-indigo-700 font-medium">
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
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for Web3 Commerce
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            SolStore provides everything you need to build, manage, and scale your Web3 ecommerce business with cutting-edge blockchain technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Feature Showcase */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Built for the Future of Commerce
              </h2>
              <p className="text-lg text-gray-600">
                SolStore combines the best of traditional ecommerce with the power of Web3 technology. Create stores that are truly owned by you, with no middlemen taking cuts from your sales.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-gray-700">Zero platform fees on transactions</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-gray-700">Complete ownership of your store data</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-gray-700">Instant global payments</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  <span className="text-gray-700">Built-in fraud protection</span>
                </li>
              </ul>
              <Link
                href="/onboard"
                className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Start Building Today
              </Link>
            </div>
            <div className="relative">
              <Image
                src="/solstoreDash.jpg"
                alt="SolStore Dashboard"
                width={600}
                height={400}
                className="rounded-lg border border-gray-200"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}