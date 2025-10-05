"use client"
import React from 'react';
import { Flame, User, LogOut, ArrowRight, CheckCircle, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useWallet } from '@/hooks/useWallet';
import { WalletService } from '@/lib/wallet';

export default function HowItWorksPage() {
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

  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description: "Start by connecting your Solana wallet. We support all major wallets including Phantom, Solflare, and more.",
      image: "/solstoreDash.jpg"
    },
    {
      number: "02", 
      title: "Create Your Store",
      description: "Set up your store profile, add your branding, and customize your storefront to match your vision.",
      image: "/solstoreDash.jpg"
    },
    {
      number: "03",
      title: "Add Products",
      description: "Upload your digital products, set prices in SOL or USDC, and configure your product details.",
      image: "/solstoreDash.jpg"
    },
    {
      number: "04",
      title: "Start Selling",
      description: "Share your store link and start accepting payments. All transactions are secured by the Solana blockchain.",
      image: "/solstoreDash.jpg"
    }
  ];

  return (
    <div className="h-full w-full bg-gray-50" suppressHydrationWarning>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 px-4 text-center text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          <Flame className="w-4 h-4 text-yellow-400" />
          <span>
            <strong>Simple 4-Step Process!</strong> Learn how to create your Web3 store in minutes.
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
            <Link href="/features" className="text-gray-700 hover:text-gray-900 font-medium">
              Features
            </Link>
            <Link href="/howitworks" className="text-indigo-600 hover:text-indigo-700 font-medium">
              How it works?
            </Link>
          </nav>

          {/* Wallet & CTA Section */}
          <div className="flex items-center gap-4">
            {isConnected && walletAddress ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-lg">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
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
            How SolStore Works
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Creating your Web3 store is simple and straightforward. Follow these four easy steps to start selling digital products on the blockchain.
          </p>
          <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            <Play className="w-5 h-5" />
            Watch Demo Video
          </button>
        </div>

        {/* Steps Section */}
        <div className="space-y-24">
          {steps.map((step, index) => (
            <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-bold text-indigo-600">{step.number}</span>
                  <div className="w-12 h-0.5 bg-indigo-600"></div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{step.title}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
                <div className="flex items-center gap-2 text-indigo-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Quick and Easy Setup</span>
                </div>
              </div>
              <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={600}
                    height={400}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-24 bg-white rounded-lg border border-gray-200 p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SolStore?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for the Web3 ecosystem with features that traditional platforms can't offer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Monthly Fees</h3>
              <p className="text-gray-600">Pay only when you sell. No hidden costs or subscription fees.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Payments</h3>
              <p className="text-gray-600">Receive payments directly to your wallet in seconds.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Full Ownership</h3>
              <p className="text-gray-600">You own your store, data, and customer relationships.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of creators already selling on SolStore
          </p>
          <Link
            href="/onboard"
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-lg"
          >
            Create Your Store Now
          </Link>
        </div>
      </main>
    </div>
  );
}