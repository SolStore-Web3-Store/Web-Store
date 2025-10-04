import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

export default function WhatItDoes() {
  return (
    <div className="w-full bg-white" suppressHydrationWarning>
      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Illustration */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-full max-w-md">
                {/* Browser Window */}
                <div className="bg-white rounded-2xl  border border-gray-200 overflow-hidden">
                  {/* Browser Header */}
                  <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                    {/* Eye Icon */}
                    <div className="mb-4">
                      <div className="w-20 h-12 bg-white rounded-lg border-2 border-indigo-600 p-2 flex items-center justify-center">
                        <svg viewBox="0 0 60 30" className="w-full h-full">
                          <ellipse cx="30" cy="15" rx="28" ry="13" fill="none" stroke="#4F46E5" strokeWidth="2"/>
                          <circle cx="30" cy="15" r="8" fill="#4F46E5"/>
                          <circle cx="30" cy="15" r="4" fill="white"/>
                        </svg>
                      </div>
                    </div>

                    {/* Plus Button */}
                    <div className="absolute top-20 right-6">
                      <div className="w-8 h-8 bg-white rounded-lg border border-gray-300 flex items-center justify-center ">
                        <span className="text-gray-600 text-lg font-light">+</span>
                      </div>
                    </div>

                    {/* Image Placeholder */}
                    <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                      <div className="w-full h-24 bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 rounded flex items-center justify-center relative overflow-hidden">
                        <div className="absolute top-2 right-2 w-6 h-6 bg-pink-300 rounded-full"></div>
                        <div className="absolute bottom-3 left-3">
                          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-purple-400 opacity-70"></div>
                        </div>
                      </div>
                    </div>

                    {/* Input Field */}
                    <div className="bg-white rounded-lg border border-gray-300 px-3 py-2 mb-4">
                      <input 
                        type="text" 
                        placeholder="Drop your cover image here"
                        className="w-full text-sm text-gray-400 bg-transparent outline-none"
                        readOnly
                      />
                    </div>

                    {/* Sparkle Icons */}
                    <div className="flex justify-between items-center">
                      <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor"/>
                      </svg>
                      <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>

                  {/* Sidebar Menu */}
                  <div className="absolute top-16 right-0 bg-white rounded-l-xl  border border-gray-200 p-3 w-52">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-xs"></div>
                        <div>
                          <div className="font-medium text-gray-900">Store</div>
                          <div className="text-xs text-gray-500">View stores</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
                          <div className="w-3 h-0.5 bg-gray-600"></div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Orders</div>
                          <div className="text-xs text-gray-500">View orders</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                         <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
                          <div className="w-3 h-0.5 bg-gray-600"></div>
                        </div>     <div>
                          <div className="font-medium text-gray-900">Product</div>
                          <div className="text-xs text-gray-500">View produts</div>
                        </div>
                      </div>
                  
                    </div>
                  </div>
                </div>

                {/* Decorative Sparkle */}
                <div className="absolute -top-4 left-1/3">
                  <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Everything you need to create and manage your store.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                We give you all the tools you need to build a solid foundation, understand your customers and sell your products.
               </p>
              
              {/* Features List */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-indigo-600" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 text-lg">Intuitive dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-indigo-600" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 text-lg">Accessible Store</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-indigo-600" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 text-lg">Custom domain</span>
                </div>
              </div>

              {/* CTA Button */}
              <button className="group inline-flex items-center gap-2 bg-white border-2 border-gray-900 rounded-lg px-6 py-3 font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200">
                Start selling now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <hr className="border-gray-200" />
      </div>

      {/* Community Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Illustration */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative w-full max-w-md">
                {/* Browser Window */}
                <div className="bg-white rounded-2xl  border border-gray-200 overflow-hidden">
                  {/* Browser Header */}
                  <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="p-6 bg-white">
                    {/* Content Block */}
                    <div className="bg-gray-50 rounded-lg h-32 mb-4 border border-gray-200"></div>
                    
                    {/* Door Illustration */}
                    <div className="relative">
                      <div className="bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-lg h-48 border-l-4 border-yellow-400 relative overflow-hidden">
                        {/* Door Frame */}
                        <div className="absolute bottom-0 right-8 w-24 h-32">
                          {/* Door */}
                          <div className="absolute inset-0 bg-gradient-to-br from-teal-300 to-teal-400 rounded-t-3xl border-2 border-teal-600">
                            {/* Door Handle */}
                            <div className="absolute right-2 top-16 w-8 h-1 bg-orange-400 rounded-full"></div>
                            <div className="absolute right-2 top-16 w-2 h-2 bg-orange-400 rounded-full"></div>
                          </div>
                          {/* Door Frame Top */}
                          <div className="absolute -top-2 -left-2 -right-2 h-3 bg-gray-700 rounded-t"></div>
                          {/* Door Frame Sides */}
                          <div className="absolute -left-2 top-0 w-2 h-full bg-gray-700"></div>
                          <div className="absolute -right-2 top-0 w-2 h-full bg-gray-700"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full border-4 border-white  flex items-center justify-center">
                      <div className="text-2xl">😊</div>
                    </div>
                  </div>
                </div>

                {/* Decorative Sparkle */}
                <div className="absolute top-8 left-8">
                  <svg className="w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Join a thriving community of creators and entrepreneurs.
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with like-minded individuals, share your journey, and get inspired to take your store to the next level.
                  </p>
              
              {/* Features List */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-indigo-600" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 text-lg">Discover page</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-indigo-600" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 text-lg">Newsletters</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-indigo-600" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 text-lg">Insight analytics</span>
                </div>
              </div>

              {/* CTA Button */}
              <button className="group inline-flex items-center gap-2 bg-white border-2 border-gray-900 rounded-lg px-6 py-3 font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200">
                Join the community
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}