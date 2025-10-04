"use client";
import React, { useState } from 'react';
import { Wallet, Store, Link as LinkIcon, Image as ImageIcon, CheckCircle, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import Stepper from '@/components/ui/stepper';
import Image from 'next/image';

const steps = ['Connect Wallet', 'Store Details', 'Store Slug', 'Store Icon', 'Complete'];

export default function Onboard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    walletConnected: false,
    storeName: '',
    storeSlug: '',
    storeIcon: null as File | null,
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return formData.walletConnected;
      case 1: return formData.storeName.trim().length > 0;
      case 2: return formData.storeSlug.trim().length > 0;
      case 3: return true; // Icon is optional
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-700">
        <div className="flex w-full items-center justify-between max-w-7xl mx-auto  text-black px-4 py-4">
          <div className="flex items-center gap-2">
             <Image src={'/solStore_icon.png'}
                     height={80}
                     width={80}
                     alt='SolStore_Logo'/>
          </div>

          <Info/>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto  text-black px-4 py-12">
        {/* Progress Stepper */}
        <div className="mb-12">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-700 p-8">
          {currentStep === 0 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                <Wallet className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Connect your Solana wallet to start creating your Web3 store and receive payments in SOL.
              </p>
              <button
                onClick={() => handleInputChange('walletConnected', true)}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  formData.walletConnected
                    ? 'bg-green-600 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {formData.walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
              </button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Name Your Store</h2>
                <p className="text-gray-600">Choose a name that represents your brand and products.</p>
              </div>
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => handleInputChange('storeName', e.target.value)}
                  placeholder="Enter your store name"
                  className="w-full  text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LinkIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Create Store URL</h2>
                <p className="text-gray-600">Choose a unique URL slug for your store.</p>
              </div>
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Slug
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <span className="px-3 py-3 bg-gray-400/20 text-gray-500 text-sm">
                    solstore.vercel.app/
                  </span>
                  <input
                    type="text"
                    value={formData.storeSlug}
                    onChange={(e) => handleInputChange('storeSlug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="your-store"
                    className="flex-1 px-3 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-0 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Store Icon</h2>
                <p className="text-gray-600">Upload an icon for your store (optional).</p>
              </div>
              <div className="max-w-md mx-auto">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInputChange('storeIcon', e.target.files?.[0] || null)}
                    className="hidden"
                    id="store-icon"
                  />
                  <label htmlFor="store-icon" className="cursor-pointer">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Click to upload store icon</p>
                    <p className="text-sm text-gray-400 mt-2">PNG, JPG up to 2MB</p>
                  </label>
                  {formData.storeIcon && (
                    <p className="text-sm text-green-600 mt-2">
                      {formData.storeIcon.name} uploaded
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Store Created Successfully!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Your Web3 store is ready. You can now start adding products and accepting SOL payments.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="font-medium text-gray-900 mb-2">Store Details:</h3>
                <div className="text-left space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {formData.storeName}</p>
                  <p><span className="font-medium">URL:</span> solstore.com/{formData.storeSlug}</p>
                  <p><span className="font-medium">Wallet:</span> Connected</p>
                </div>
              </div>
              <Link href='/admin' className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isStepValid()
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}