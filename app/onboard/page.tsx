"use client";
import React, { useState, useEffect } from 'react';
import { Wallet, Store, Link as LinkIcon, Image as ImageIcon, CheckCircle, ArrowRight, ArrowLeft, Info, AlertCircle, ChevronDown, ChevronRight, InfoIcon } from 'lucide-react';
import Link from 'next/link';
import Stepper from '@/components/ui/stepper';
import Image from 'next/image';
import { useWallet } from '@/hooks/useWallet';
import { storeApi, uploadApi, healthApi, ApiError } from '@/lib/api';
import { validation, formatFileSize } from '@/lib/validation';
import { WalletConnectButton } from '@/components/wallet/wallet-connect-button';

const steps = ['Connect Wallet', 'Store Details', 'Store Slug', 'Store Icon', 'Complete'];

export default function Onboard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    storeName: '',
    storeSlug: '',
    storeIcon: null as File | null,
    storeIconUrl: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdStore, setCreatedStore] = useState<{
    id: string;
    name: string;
    slug: string;
    status: string;
    description?: string;
    icon?: string;
    ownerId: string;
    createdAt: string;
  } | null>(null);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

  const {
    isConnected,
    walletAddress,
    error: walletError,
    isWalletDetected
  } = useWallet();

  // Check backend availability on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION
          : process.env.NEXT_PUBLIC_API_URL}/health`);
        setBackendAvailable(response.ok);
      } catch (error) {
        console.error('Backend health check failed:', error);
        setBackendAvailable(false);
      }
    };
    
    checkBackend();
  }, []);


  // Check slug availability with debounce
  useEffect(() => {
    if (!formData.storeSlug.trim()) {
      setSlugAvailable(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setCheckingSlug(true);
      try {
        await storeApi.getStoreBySlug(formData.storeSlug);
        setSlugAvailable(false); // Store exists, slug not available
      } catch (error) {
        if (error instanceof ApiError && error.code === 'NOT_FOUND') {
          setSlugAvailable(true); // Store not found, slug available
        } else {
          setSlugAvailable(null); // Error checking
        }
      } finally {
        setCheckingSlug(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.storeSlug]);

  const handleNext = async () => {
    if (currentStep === 3) {
      // Upload icon and create store
      await handleCreateStore();
    } else if (currentStep < steps.length - 1) {
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
    setError(null);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return isConnected;
      case 1:
        return formData.storeName.trim().length >= 2;
      case 2:
        const slugValidation = validation.storeSlug(formData.storeSlug);
        return !slugValidation && slugAvailable === true;
      case 3:
        return true; // Icon is optional
      default:
        return false;
    }
  };

  const handleCreateStore = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let storeIconUrl = '';

      // Upload icon if provided
      if (formData.storeIcon) {
        const uploadResult = await uploadApi.uploadStoreIcon(formData.storeIcon);
        storeIconUrl = uploadResult.url;
      }

      // Create store
      const storeData = {
        storeName: formData.storeName,
        storeSlug: formData.storeSlug,
        storeIcon: storeIconUrl,
        description: formData.description,
      };

      const store = await storeApi.createStore(storeData);
      setCreatedStore(store);
      setCurrentStep(4); // Move to success step
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : 'Failed to create store. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };





  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-700">
        <div className="flex w-full items-center justify-between max-w-7xl mx-auto text-black px-4 py-4">
          <div className="flex items-center gap-2">
            <Image src={'/solStore_icon.png'}
              height={80}
              width={80}
              alt='SolStore_Logo' />
          </div>
          <InfoIcon/>

        
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto  text-black px-4 py-12">
        {/* Progress Stepper */}
        <div className="mb-12">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

     

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <div className="flex-1">
                <p className="text-sm">{error}</p>
                {error.includes('Backend server is not running') && (
                  <div className="mt-2 text-xs">
                    <p>Solution:</p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li>Start your backend server: <code className="bg-gray-100 px-1 rounded">npm run dev</code> in backend folder</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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

              {isWalletDetected && !isConnected && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <div className="text-blue-800 text-sm">
                    <p className="font-medium mb-1">How to connect:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Click &quot;Connect Wallet&quot; below</li>
                      <li>Approve the connection in your Phantom wallet popup</li>
                      <li>Sign the authentication message</li>
                    </ol>
                  </div>
                </div>
              )}

              {!isWalletDetected && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">
                      Phantom wallet not detected.
                      <a
                        href="https://phantom.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline ml-1"
                      >
                        Install Phantom
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {walletError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <div className="flex-1">
                      <p className="text-sm">{walletError}</p>
                      {walletError.includes('cancelled') || walletError.includes('rejected') ? (
                        <p className="text-xs mt-1 text-red-600">
                          Click &quot;Connect Wallet&quot; again and approve the connection in your Phantom wallet.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}



              <div className="max-w-md mx-auto">
                <WalletConnectButton
                  onSuccess={(address: string) => {
                    console.log('Wallet connected successfully:', address);
                  }}
                  onError={(error: string) => {
                    setError(error);
                  }}
                />
              </div>

              {isConnected && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <div className="text-blue-800 text-sm">
                    <p className="font-medium mb-1">✅ Ready to continue!</p>
                    <p className="text-xs">Your wallet is connected and authenticated. Click &quot;Next&quot; to proceed.</p>
                  </div>
                </div>
              )}
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
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                    placeholder="Enter your store name"
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength={255}
                  />
                  {formData.storeName && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.storeName.length}/255 characters
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what your store sells..."
                    rows={3}
                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    maxLength={1000}
                  />
                  {formData.description && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/1000 characters
                    </p>
                  )}
                </div>
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
                <div className="mb-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Info className="w-4 h-4" />
                      <p className="text-xs">
                        Reserved names like "admin", "store", "explore" etc. cannot be used
                      </p>
                    </div>
                  </div>
                </div>
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

                {/* Slug validation and availability indicator */}
                {formData.storeSlug && (
                  <div className="mt-2">
                    {(() => {
                      const validationError = validation.storeSlug(formData.storeSlug);
                      if (validationError) {
                        return <p className="text-sm text-red-600">✗ {validationError}</p>;
                      }
                      if (checkingSlug) {
                        return <p className="text-sm text-gray-500">Checking availability...</p>;
                      }
                      if (slugAvailable === true) {
                        return <p className="text-sm text-green-600">✓ Slug is available</p>;
                      }
                      if (slugAvailable === false) {
                        return <p className="text-sm text-red-600">✗ Slug is already taken</p>;
                      }
                      return null;
                    })()}
                  </div>
                )}
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
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        // Validate file
                        const sizeError = validation.fileSize(file, 4);
                        const typeError = validation.fileType(file, [
                          'image/jpeg', 'image/png', 'image/gif', 'image/webp'
                        ]);

                        if (sizeError || typeError) {
                          setError(sizeError || typeError);
                          return;
                        }
                      }
                      handleInputChange('storeIcon', file);
                    }}
                    className="hidden"
                    id="store-icon"
                  />
                  <label htmlFor="store-icon" className="cursor-pointer">
                    {formData.storeIcon ? (
                      <div className="space-y-2">
                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-green-600 font-medium">{formData.storeIcon.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(formData.storeIcon.size)}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleInputChange('storeIcon', null);
                          }}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Click to upload store icon</p>
                        <p className="text-sm text-gray-400 mt-2">PNG, JPG, GIF, WebP up to 4MB</p>
                      </div>
                    )}
                  </label>
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
              {createdStore && (
                <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto border border-gray-400">
                  <h3 className="font-medium text-gray-900 mb-2 text-left ">Store Details:</h3>
                  <div className="text-left space-y-2 text-sm">
                    <p><span className="font-medium ">Name:</span> {createdStore.name}</p>
                    <p><span className="font-medium">URL:</span><a href={`https://web-store-mauve.vercel.app/${createdStore.slug}`} className='hover:underline hover:text-blue-600'> web-store-mauve.vercel.app/{createdStore.slug}</a></p>
                    <p><span className="font-medium">Wallet:</span> {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}</p>
                    <p><span className="font-medium">Status:</span> {createdStore.status}</p>
                  </div>
                </div>
              )}
              <div className="flex gap-4 justify-center">
                <Link
                  href='/admin'
                  className="flex items-center gap-1 bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  
                >
                 <ChevronRight/> Go to Dashboard
                </Link>
                {createdStore && (
                  <Link
                    href={`/${createdStore.slug}`}
                    className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    View Store
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

     

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={isLoading || !canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                !isLoading && canProceed()
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Store...
                </>
              ) : currentStep === 3 ? (
                <>
                  Create Store
                  <CheckCircle className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}