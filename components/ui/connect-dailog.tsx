"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { X, LoaderCircle } from "lucide-react";

// Dialog Components
const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { open, onOpenChange });
        }
        return child;
      })}
    </>
  );
};

const DialogTrigger = ({ asChild, children, onOpenChange }) => {
  const handleClick = () => {
    onOpenChange?.(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick });
  }

  return <div onClick={handleClick}>{children}</div>;
};

const DialogOverlay = ({ open }) => {
  if (!open) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
      style={{ animation: open ? 'fadeIn 0.2s ease-out' : 'fadeOut 0.2s ease-out' }}
    />
  );
};

const DialogContent = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in-0 zoom-in-95"
        style={{ animation: 'slideIn 0.2s ease-out' }}
      >
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
};

const DialogTitle = ({ children, className = "" }) => {
  return (
    <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h2>
  );
};

const DialogDescription = ({ children, className = "" }) => {
  return (
    <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      {children}
    </p>
  );
};

const DialogClose = ({ onOpenChange, children, className = "" }) => {
  return (
    <button
      onClick={() => onOpenChange?.(false)}
      className={`absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none ${className}`}
    >
      {children}
    </button>
  );
};

// Button Component
const Button = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 focus:ring-gray-400"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 py-3 text-base"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Main Connect Wallet Dialog Component
const ConnectWalletDialog = ({
  trigger,
  title,
  description,
  ...dialogProps
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { wallets, select, connecting, wallet } = useWallet();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} {...dialogProps}>
      <DialogTrigger asChild onOpenChange={setIsDialogOpen}>
        {trigger || <Button>Connect Wallet</Button>}
      </DialogTrigger>
      
      <DialogOverlay open={isDialogOpen} />
      
      <DialogContent open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {title || "Connect Wallet"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {description || "Connect your wallet to continue"}
          </DialogDescription>
        </DialogHeader>
        
        <ul className="mt-6 flex flex-col gap-3">
          {wallets.map((walletItem) => (
            <li key={walletItem.adapter.name}>
              <Button
                variant="secondary"
                size="lg"
                className="w-full justify-start gap-3 disabled:opacity-80"
                onClick={() => {
                  select(walletItem.adapter.name);
                  setIsDialogOpen(false);
                }}
                disabled={connecting}
              >
                <img
                  src={walletItem.adapter.icon}
                  alt={walletItem.adapter.name}
                  width={24}
                  height={24}
                  className="rounded"
                />
                <span className="flex-1 text-left">{walletItem.adapter.name}</span>
                {connecting && wallet?.adapter.name === walletItem.adapter.name && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
              </Button>
            </li>
          ))}
        </ul>
        
        <DialogClose onOpenChange={setIsDialogOpen}>
          <X size={16} />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

// Demo Component
export default function ConnectButton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Solana Wallet Connect
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          This is a demo showing the dialog structure
        </p>
        <ConnectWalletDialog />
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
          Note: Wallet adapter context is required for full functionality
        </p>
      </div>
    </div>
  );
}