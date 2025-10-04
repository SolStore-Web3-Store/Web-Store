// Debug utilities for development
export const debug = {
  isEnabled: process.env.NODE_ENV === 'development',
  
  log: (message: string, data?: unknown) => {
    if (debug.isEnabled) {
      console.log(`[SolStore Debug] ${message}`, data || '');
    }
  },
  
  error: (message: string, error?: unknown) => {
    if (debug.isEnabled) {
      console.error(`[SolStore Error] ${message}`, error || '');
    }
  },
  
  wallet: {
    checkPhantom: () => {
      if (typeof window === 'undefined') return false;
      
      const phantom = window.solana;
      debug.log('Phantom wallet check:', {
        exists: !!phantom,
        isPhantom: phantom?.isPhantom,
        isConnected: phantom?.isConnected,
        publicKey: phantom?.publicKey?.toBase58?.() || phantom?.publicKey?.toString?.(),
      });
      
      return !!phantom?.isPhantom;
    },
    
    logConnectionAttempt: (step: string, data?: unknown) => {
      debug.log(`Wallet connection - ${step}`, data);
    },
  },
  
  api: {
    logRequest: (method: string, url: string, data?: unknown) => {
      debug.log(`API ${method} ${url}`, data);
    },
    
    logResponse: (method: string, url: string, response: unknown) => {
      debug.log(`API ${method} ${url} response`, response);
    },
    
    logError: (method: string, url: string, error: unknown) => {
      debug.error(`API ${method} ${url} error`, error);
    },
  },
};