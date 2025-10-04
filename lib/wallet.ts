// Wallet utility functions for Solana integration
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { authApi } from './api';
import { debug } from './debug';

export interface PhantomWallet {
  isPhantom?: boolean;
  publicKey?: PublicKey;
  isConnected?: boolean;
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: PublicKey }>;
  disconnect(): Promise<void>;
  signMessage(message: Uint8Array, display?: 'utf8' | 'hex'): Promise<{ signature: Uint8Array; publicKey: PublicKey }>;
  signTransaction(transaction: unknown): Promise<unknown>;
  signAllTransactions(transactions: unknown[]): Promise<unknown[]>;
}

declare global {
  interface Window {
    solana?: PhantomWallet;
  }
}

export class WalletService {
  private static instance: WalletService;
  private wallet: PhantomWallet | null = null;

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  async detectWallet(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    // Check for Phantom wallet
    const detected = this.isPhantomInstalled();
    if (detected) {
      this.wallet = window.solana!;
      return true;
    }

    // Wait a bit for wallet to load
    debug.wallet.logConnectionAttempt('Waiting for wallet to load...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const finalCheck = this.isPhantomInstalled();
    if (finalCheck) {
      this.wallet = window.solana!;
    }
    
    debug.wallet.logConnectionAttempt('Final wallet detection', { detected: finalCheck });
    return finalCheck;
  }

  private isPhantomInstalled(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window.solana?.isPhantom);
  }

  async connectWallet(): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('Wallet connection only available in browser');
    }

    if (!this.isPhantomInstalled()) {
      throw new Error('Phantom wallet not detected. Please install Phantom wallet from https://phantom.app/');
    }

    if (!this.wallet) {
      this.wallet = window.solana!;
    }

    try {
      debug.wallet.logConnectionAttempt('Requesting wallet connection...');
      
      // Connect to Phantom wallet
      const response = await this.wallet.connect();
      const walletAddress = response.publicKey.toString();
      
      debug.wallet.logConnectionAttempt('Wallet connected successfully', { 
        address: walletAddress,
        publicKey: response.publicKey.toBase58()
      });
      
      // Store wallet info
      localStorage.setItem('wallet_address', walletAddress);
      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('wallet_public_key', response.publicKey.toBase58());
      
      return walletAddress;
    } catch (error: unknown) {
      debug.wallet.logConnectionAttempt('Wallet connection failed', error);
      
      const err = error as { code?: number; message?: string };
      
      // Handle specific error cases
      if (err?.code === 4001 || err?.message?.includes('User rejected')) {
        throw new Error('Connection cancelled. Please try again and approve the connection request.');
      }
      
      if (err?.code === -32002) {
        throw new Error('Connection request already pending. Please check your wallet.');
      }
      
      if (err?.code === -32603) {
        throw new Error('Wallet is locked. Please unlock your Phantom wallet and try again.');
      }
      
      throw new Error('Failed to connect to Phantom wallet. Please try again.');
    }
  }

  async signMessage(message: string): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('Message signing only available in browser');
    }

    if (!this.wallet || !this.isPhantomInstalled()) {
      throw new Error('Phantom wallet not connected');
    }

    try {
      debug.wallet.logConnectionAttempt('Signing message...', { messageLength: message.length });
      
      // Encode message as UTF-8 bytes
      const encodedMessage = new TextEncoder().encode(message);
      
      // Sign the message with Phantom
      const signedMessage = await this.wallet.signMessage(encodedMessage, 'utf8');
      
      // Convert signature to base58 string (Solana standard)
      const signatureBase58 = bs58.encode(signedMessage.signature);
      
      debug.wallet.logConnectionAttempt('Message signed successfully', { 
        signatureLength: signatureBase58.length,
        publicKey: signedMessage.publicKey.toBase58()
      });
      
      return signatureBase58;
    } catch (error) {
      debug.wallet.logConnectionAttempt('Message signing failed', error);
      
      const err = error as { code?: number; message?: string };
      
      if (err?.code === 4001 || err?.message?.includes('User rejected')) {
        throw new Error('Signature cancelled. Please try again and approve the signature request.');
      }
      
      throw new Error('Failed to sign message with wallet. Please try again.');
    }
  }

  async authenticateWithBackend(walletAddress: string): Promise<{
    token: string;
    user: Record<string, unknown>;
  }> {
    const message = `Sign in to SolStore\nTimestamp: ${Date.now()}`;
    
    try {
      const signature = await this.signMessage(message);
      
      const authResult = await authApi.connectWallet(walletAddress, signature, message);
      
      // Store auth token
      localStorage.setItem('auth_token', authResult.token);
      localStorage.setItem('user_data', JSON.stringify(authResult.user));
      
      return authResult;
    } catch (error) {
      debug.wallet.logConnectionAttempt('Backend authentication failed', error);
      throw error;
    }
  }

  async disconnectWallet(): Promise<void> {
    if (this.wallet && this.isPhantomInstalled()) {
      try {
        await this.wallet.disconnect();
        debug.wallet.logConnectionAttempt('Wallet disconnected successfully');
      } catch (error) {
        debug.wallet.logConnectionAttempt('Failed to disconnect wallet', error);
      }
    }

    // Clear stored data
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_public_key');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    this.wallet = null;
  }

  isWalletConnected(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('wallet_connected') === 'true';
  }

  getWalletAddress(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('wallet_address');
  }

  getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  getUserData(): unknown | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
}