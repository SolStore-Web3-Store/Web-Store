import React from 'react'

interface CheckoutLayoutProps {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}

const CheckoutLayout = async ({ children }: CheckoutLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default CheckoutLayout