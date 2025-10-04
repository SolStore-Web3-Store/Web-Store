"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Menu,
  X,
  Store
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface SidebarProps {
  currentStore?: string;
}

const stores = [
  { name: "CryptoArt Gallery", slug: "cryptoart-gallery", icon: "🎨" },
  { name: "Web3 Tools Store", slug: "web3-tools", icon: "🛠️" }
];

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/store' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/store/orders' },
  { icon: Package, label: 'Products', href: '/admin/store/products' },
  { icon: Settings, label: 'Settings', href: '/admin/store/settings' },
];

export default function Sidebar({ currentStore = "cryptoart-gallery" }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const selectedStore = stores.find(store => store.slug === currentStore) || stores[0];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center gap-2">
         
             <Image src={'/solStore_icon.png'}
                                 height={80}
                                 width={80}
                                 alt='SolStore_Logo'/>
          
        </div>
      </div>

      {/* Store Selector */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <button
            onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-400/20 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{selectedStore.icon}</span>
              {!isCollapsed && (
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {selectedStore.name}
                  </p>
                  <p className="text-xs text-gray-500">Current Store</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                isStoreDropdownOpen ? 'rotate-180' : ''
              }`} />
            )}
          </button>

          {/* Store Dropdown */}
          {isStoreDropdownOpen && !isCollapsed && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {stores.map((store) => (
                <Link
                  key={store.slug}
                  href={`/admin/store?store=${store.slug}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  onClick={() => setIsStoreDropdownOpen(false)}
                >
                  <span className="text-lg">{store.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{store.name}</p>
                    <p className="text-xs text-gray-500">/{store.slug}</p>
                  </div>
                </Link>
              ))}
              <div className="border-t border-gray-200">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors rounded-b-lg text-indigo-600"
                  onClick={() => setIsStoreDropdownOpen(false)}
                >
                  <Store className="w-4 h-4" />
                  <span className="text-sm font-medium">All Stores</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={`${item.href}?store=${currentStore}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <item.icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                {!isCollapsed && (
                  <span className="font-medium text-gray-700 group-hover:text-gray-900">
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">SolStore</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-full">
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        <SidebarContent />
      </div>
    </>
  );
}