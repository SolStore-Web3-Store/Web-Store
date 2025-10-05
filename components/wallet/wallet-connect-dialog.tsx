"use client";
import React, { useState } from 'react';
import { Wallet, AlertCircle } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { WalletConnectButton } from '@/components/wallet/wallet-connect-button';
import { useWallet } from '@/hooks/useWallet';

interface WalletConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (address: string) => void;
}

export function WalletConnectDialog({ isOpen, onClose, onSuccess }: WalletConnectDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const {
    isConnected,
    walletAddress,
    error: walletError,
    isWalletDetected
  } = useWallet();

  // Track if wallet was connected during this dialog session
  const [wasConnectedOnMount, setWasConnectedOnMount] = useState(false);

  // Track initial connection state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setWasConnectedOnMount(isConnected);
    }
  }, [isOpen, isConnected]);

  // Auto-close dialog when wallet gets connected (but only if it wasn't connected when dialog opened)
  React.useEffect(() => {
    if (isOpen && isConnected && walletAddress && !wasConnectedOnMount) {
      onSuccess?.(walletAddress);
      onClose();
    }
  }, [isOpen, isConnected, walletAddress, wasConnectedOnMount, onSuccess, onClose]);

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose}
      className="max-w-lg"
    >
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
          <Wallet className="w-8 h-8 text-indigo-600" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">
            Connect your Solana wallet to access your dashboard and manage your Web3 store.
          </p>
        </div>

        {isWalletDetected && !isConnected && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-800 text-sm">
              <p className="font-medium mb-1">How to connect:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Click "Connect Wallet" below</li>
                <li>Approve the connection in your Phantom wallet popup</li>
                <li>Sign the authentication message</li>
              </ol>
            </div>
          </div>
        )}

        {!isWalletDetected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
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

        {(walletError || error) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <div className="flex-1">
                <p className="text-sm">{walletError || error}</p>
                {(walletError?.includes('cancelled') || walletError?.includes('rejected')) && (
                  <p className="text-xs mt-1 text-red-600">
                    Click "Connect Wallet&quot; again and approve the connection in your Phantom wallet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto">
          <WalletConnectButton
            onSuccess={(address: string) => {
              console.log('Wallet connected successfully:', address);
              setError(null);
            }}
            onError={(error: string) => {
              setError(error);
            }}
          />
        </div>

        {isConnected && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-800 text-sm">
              <p className="font-medium mb-1">✅ Connected successfully!</p>
              <p className="text-xs">Your wallet is connected and authenticated.</p>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}