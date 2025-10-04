"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WalletService } from '@/lib/wallet';
import { useWallet } from '@/hooks/useWallet';
import { Loading } from '@/components/ui/loading';
import { Wallet, AlertCircle } from 'lucide-react';
import { WalletConnectButton } from '@/components/wallet/wallet-connect-button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { isConnected, walletAddress } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const walletService = WalletService.getInstance();
      const token = walletService.getAuthToken();
      const connected = walletService.isWalletConnected();
      
      setAuthToken(token);
      
      // If no wallet connection or no auth token, user needs to authenticate
      if (!connected || !token) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [isConnected, walletAddress]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Show authentication required screen
  if (!isConnected || !authToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h1>
            <p className="text-gray-600 mb-6">
              You need to connect your wallet and authenticate to access the admin panel.
            </p>
            
            {!isConnected ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Connect your Solana wallet to continue
                </p>
                <WalletConnectButton 
                  onSuccess={() => {
                    // Refresh the page after successful connection
                    window.location.reload();
                  }}
                />
              </div>
            ) : !authToken ? (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium">Authentication Incomplete</p>
                      <p className="text-sm">
                        Your wallet is connected but you need to complete authentication.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Go to Homepage
                </button>
              </div>
            ) : null}
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Your wallet serves as your secure login to SolStore
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, render the admin content
  return <>{children}</>;
}