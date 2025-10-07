// Real Solana wallet connection button component
import React, { useState } from 'react';
import { Wallet, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

interface WalletConnectButtonProps {
  onSuccess?: (address: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function WalletConnectButtonMini({ 
  onSuccess, 
  onError, 
  className = '' 
}: WalletConnectButtonProps) {
  const { 
    isConnected, 
    walletAddress, 
    isConnecting, 
    error, 
    connectWallet, 
    disconnectWallet,
    isWalletDetected 
  } = useWallet();

  const [showInstructions, setShowInstructions] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
      if (walletAddress) {
        onSuccess?.(walletAddress);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      onError?.(errorMessage);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  if (!isWalletDetected) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Phantom Wallet Required</p>
              <p className="text-xs">Install Phantom wallet to connect to SolStore</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <a
            href="https://phantom.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Install Phantom
          </a>
          
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Instructions
          </button>
        </div>

        {showInstructions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How to install Phantom:</h4>
            <ol className="list-decimal list-inside space-y-1 text-xs text-blue-800">
              <li>Visit <a href="https://phantom.app/" className="underline">phantom.app</a></li>
              <li>Click &quot;Add to Chrome&quot; (or your browser)</li>
              <li>Create a new wallet or import existing one</li>
              <li>Refresh this page and try connecting again</li>
            </ol>
          </div>
        )}
      </div>
    );
  }

  if (isConnected && walletAddress) {
    return (
      <div className="space-y-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <div className="flex-1">
              <p className="font-medium">Wallet Connected</p>
              <p className="text-xs font-mono">
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleDisconnect}
          className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          Disconnect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="text-xs">{error}</p>
              {error.includes('cancelled') && (
                <p className="text-xs mt-1">
                  Click &quot;Connect Wallet&quot; again and approve the connection in Phantom.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-medium transition-colors ${
          isConnecting
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        } ${className}`}
      >
        {isConnecting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-5 h-5" />
            Connect Phantom Wallet
          </>
        )}
      </button>

    </div>
  );
}