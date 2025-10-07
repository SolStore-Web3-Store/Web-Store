"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WalletService } from "@/lib/wallet";
import { useWallet } from "@/hooks/useWallet";
import { Loading } from "@/components/ui/loading";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { isConnected, walletAddress } = useWallet();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const walletService = WalletService.getInstance();
      const token = walletService.getAuthToken();
      const connected = walletService.isWalletConnected();

      // Simple, readable logic
      if (connected && token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace("/"); // Use router.replace() instead of redirect()
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [isConnected, walletAddress, router]);

  // Loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Authenticated users see content
  if (isAuthenticated) {
    return <div className="flex flex-col w-full h-full bg-white">{children}</div>;
  }

  // While redirecting (prevents flicker)
  return null;
}
