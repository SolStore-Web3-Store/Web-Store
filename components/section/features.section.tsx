"use client";
import React from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function Features() {
  return (
    <div className="h-full w-full bg-white text-black" suppressHydrationWarning>
      {/* Hero Section */}
      <section className="border-y border-gray-700 w-full">
        <div className="grid md:grid-cols-2 min-h-[280px]">
          {/* Left Column - Headline */}
          <div className="flex items-center justify-center p-12 md:p-16 border-r border-gray-700">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
              Web3 Sellers{' '}
              <span className="italic underline decoration-2 underline-offset-4">
                (finally)
              </span>{' '}
              have a home
            </h1>
          </div>

          {/* Right Column - Description */}
          <div className="flex flex-col items-start justify-center p-12 md:p-16 bg-white">
            <p className="text-md md:text-lg leading-relaxed text-gray-800 mb-8">
              Sell products, Create stores, analyse, discover other Web3 sellers and
              brands... SolanaStore is the best Web3 alternative to Take.app
              We give you all the tools you need to shape your community and make your stories
              come to life.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-900 rounded-full text-base font-medium hover:bg-gray-900 hover:text-white transition-colors duration-200">
              See all features
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Scrolling Banner */}
      <div className="bg-indigo-100 border-b border-gray-700 overflow-hidden py-4">
        <div className="animate-scroll whitespace-nowrap">
          <span className="inline-block text-2xl md:text-3xl lg:text-4xl font-bold px-4">
            CREATE * OWN * EDIT * SELL * SHARE * GROW * ANALYSE * EARN * WRITE * CREATE * OWN * EDIT * SELL * SHARE * GROW * ANALYSE * EARN * WRITE
          </span>
        </div>
      </div>

      {/* Features Section */}
      <section className="border-b border-gray-700 px-10">
        <div className="grid md:grid-cols-2">
          {/* Bitcoin & IPFS Feature */}
          <div className="p-12 md:p-16 lg:border-r  sm:border-transparent border-gray-700 flex flex-col">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Recieve payments in Solana
            </h2>
            
            <div className="mb-12 flex gap-4">
              {/* Solana Icon */}
              <Image
                src="/solana.png"
                alt="Solana Logo"
                width={300}
                height={300}
                className="rounded-full"
              />
            
            </div>

            <p className="text-lg leading-relaxed text-gray-800">
              Want to sell digital products and receive payments in Solana? <br/>
              <span className="font-bold">Create your store.</span>{' '}
           list your products and start accepting SOL payments from your customers.
            </p>
          </div>

          {/* SEO Feature */}
          <div className="p-12 md:p-16 flex flex-col bg-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              SEO-optimized custom store
            </h2>
            
            <div className="mb-12 relative">
              {/* URL Bar Mockup */}
              <div className="bg-pink-100 rounded-full px-6 py-4 border-2 border-gray-700 flex items-center relative">
                <span className="text-base text-gray-600">
                https://web-store-mauve.vercel.app/<span className="font-bold text-gray-900">my-store-name</span>
                </span>
                {/* Cursor Hand */}
                <div className="absolute -bottom-2 left-1/3">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-gray-600">
                    <path d="M10 13V8.5C10 7.67 10.67 7 11.5 7C12.33 7 13 7.67 13 8.5V12.5" stroke="currentColor" strokeWidth="2"/>
                    <path d="M13 12.5V8.5C13 7.67 13.67 7 14.5 7C15.33 7 16 7.67 16 8.5V12.5" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 12.5V9.5C16 8.67 16.67 8 17.5 8C18.33 8 19 8.67 19 9.5V14C19 17.31 16.31 20 13 20H11C7.69 20 5 17.31 5 14V11.5C5 10.67 5.67 10 6.5 10C7.33 10 8 10.67 8 11.5V13" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              
              {/* SEO Badge */}
              <div className="absolute -right-4 -top-4">
                <div className="bg-yellow-200 border-4 border-gray-900 rounded-full w-24 h-24 flex items-center justify-center transform rotate-12">
                  <span className="text-sm font-bold">SEO</span>
                </div>
                <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-300 rounded-full -translate-x-2 -translate-y-2"></div>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-gray-800">
              Want more control, customization and better SEO on your own
              domain? Select a template and start with an optimized blog{' '}
              <span className="font-bold">with a 100/100 lighthouse score.</span>
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}