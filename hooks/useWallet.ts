// React hook for wallet management
import { useState, useEffect, useCallback } from "react";
import { WalletService } from "@/lib/wallet";

interface UseWalletReturn {
  isConnected: boolean;
  walletAddress: string | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isWalletDetected: boolean;
}

export function useWallet(): UseWalletReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWalletDetected, setIsWalletDetected] = useState(false);

  const walletService = WalletService.getInstance();

  // Check wallet detection and connection status on mount
  useEffect(() => {
    const checkWallet = async () => {
      const detected = await walletService.detectWallet();
      setIsWalletDetected(detected);

      const connected = walletService.isWalletConnected();
      const address = walletService.getWalletAddress();

      setIsConnected(connected);
      setWalletAddress(address);
    };

    checkWallet();
  }, []);

  const connectWallet = useCallback(async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    setError(null);

    try {
      if (!isWalletDetected) {
        throw new Error(
          "Phantom wallet not detected. Please install Phantom wallet."
        );
      }

      // Connect to wallet
      const address = await walletService.connectWallet();

      // Authenticate with backend
      await walletService.authenticateWithBackend(address);

      setWalletAddress(address);
      setIsConnected(true);
    } catch (err) {
      let errorMessage = "Failed to connect wallet";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, isWalletDetected, walletService]);

  const disconnectWallet = useCallback(async () => {
    try {
      await walletService.disconnectWallet();
      setIsConnected(false);
      setWalletAddress(null);
      setError(null);
    } catch (err) {
      console.error("Wallet disconnection error:", err);
    }
  }, [walletService]);

  return {
    isConnected,
    walletAddress,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    isWalletDetected,
  };
}
