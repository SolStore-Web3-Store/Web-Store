import React from 'react'

interface CheckoutLayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}

const CheckoutLayout = async ({ children, params }: CheckoutLayoutProps) => {
  const { storeSlug } = await params;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Store: {storeSlug}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default CheckoutLayout