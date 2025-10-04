"use client";
import React, { useState } from 'react';
import { WalletService } from '@/lib/wallet';
import { debug } from '@/lib/debug';

export default function TestWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const walletService = WalletService.getInstance();

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check if wallet is detected
      const detected = await walletService.detectWallet();
      if (!detected) {
        throw new Error('Phantom wallet not detected');
      }

      // Connect wallet
      const address = await walletService.connectWallet();
      setWalletAddress(address);

      debug.log('Wallet connected successfully', { address });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect';
      setError(errorMessage);
      debug.error('Wallet connection failed', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSignMessage = async () => {
    if (!walletAddress) return;

    setError(null);

    try {
      const message = `Test message from SolStore\nTimestamp: ${Date.now()}\nWallet: ${walletAddress}`;
      const sig = await walletService.signMessage(message);
      setSignature(sig);

      debug.log('Message signed successfully', { signature: sig });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign message';
      setError(errorMessage);
      debug.error('Message signing failed', err);
    }
  };

  const handleAuthenticateWithBackend = async () => {
    if (!walletAddress) return;

    setError(null);

    try {
      const authResult = await walletService.authenticateWithBackend(walletAddress);
      debug.log('Backend authentication successful', authResult);
      alert('Authentication successful! Check console for details.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      debug.error('Backend authentication failed', err);
    }
  };

  const handleDisconnect = async () => {
    try {
      await walletService.disconnectWallet();
      setWalletAddress(null);
      setSignature(null);
      setError(null);
    } catch (err) {
      console.error('Disconnect failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Wallet Connection Test</h1>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>

          {walletAddress ? (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">✅ Connected</p>
              <p className="text-sm text-gray-600 font-mono break-all">
                Address: {walletAddress}
              </p>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">Not connected</p>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isConnecting ? 'Connecting...' : 'Connect Phantom Wallet'}
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Message Signing Test */}
        {walletAddress && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Message Signing Test</h2>

            <button
              onClick={handleSignMessage}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
            >
              Sign Test Message
            </button>

            {signature && (
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600 mb-2">Signature (Base58):</p>
                <p className="text-xs font-mono break-all text-gray-800">{signature}</p>
              </div>
            )}
          </div>
        )}

        {/* Backend Authentication Test */}
        {walletAddress && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Backend Authentication Test</h2>

            <button
              onClick={handleAuthenticateWithBackend}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Authenticate with Backend
            </button>

            <p className="text-sm text-gray-600 mt-2">
              This will sign a message and send it to the backend for authentication.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Make sure Phantom wallet is installed and unlocked</li>
            <li>Click &quot;Connect Phantom Wallet&quot;</li>
            <li>Approve the connection in Phantom popup</li>
            <li>Test message signing</li>
            <li>Test backend authentication (requires backend server running)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}