"use client";
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Store,
  AlertCircle,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { storeApi, ApiError } from '@/lib/api';
import { useWallet } from '@/hooks/useWallet';

interface SidebarProps {
  currentStore?: string;
}

interface StoreData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  status: string;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/store' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/store/orders' },
  { icon: Package, label: 'Products', href: '/admin/store/products' },
  { icon: Settings, label: 'Settings', href: '/admin/store/settings' },
];

export default function Sidebar({ currentStore }: SidebarProps) {
  const { isConnected } = useWallet();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stores from API
  useEffect(() => {
    const loadStores = async () => {
      if (!isConnected) {
        setStores([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userStores = await storeApi.getUserStores();
        setStores(userStores);
      } catch (err) {
        console.error('Error loading stores:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load stores');
        }
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, [isConnected]);

  const selectedStore = stores.find(store => store.slug === currentStore) || stores[0];

  const getStoreIcon = (store: StoreData) => {
    if (store.icon && store.icon.startsWith('http')) {
      return (
        <Image
          src={store.icon}
          alt={store.name}
          height={70}
          width={70}
          className="w-10 h-10 rounded object-cover"
        />
      );
    }

    // Fallback to emoji or default
    const emoji = store.icon || '🏪';
    return <span className="text-lg">{emoji}</span>;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center gap-2">
          <Image
            src={'/solStore_icon.png'}
            height={isCollapsed ? 40 : 80}
            width={isCollapsed ? 40 : 80}
            alt='SolStore_Logo'
            className="transition-all duration-300 object-contain"
          />
        </div>
      </div>

      {/* Store Selector */}
      <div className="p-4 border-b border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center p-3">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
            {!isCollapsed && <span className="ml-2 text-sm text-gray-600">Loading stores...</span>}
          </div>
        ) : !isConnected ? (
          <div className={`p-3 bg-yellow-50 border border-yellow-200  ${isCollapsed ? 'flex justify-center' : ''}`}>
            {isCollapsed ? (
              <div className="relative group">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Connect wallet to access stores
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Connect wallet to access stores</span>
              </div>
            )}
          </div>
        ) : stores.length === 0 ? (
          <div className={`text-center p-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
            {isCollapsed ? (
              <div className="relative group">
                <Store className="w-6 h-6 text-gray-400" />
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  No stores - Create one
                </div>
              </div>
            ) : (
              <>
                <Store className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">No stores found</p>
                <Link
                  href="/onboard"
                  className="inline-flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-1.5  hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Create Store
                </Link>
              </>
            )}
          </div>
        ) : selectedStore ? (
          <div className="relative">
            <button
              onClick={() => !isCollapsed && setIsStoreDropdownOpen(!isStoreDropdownOpen)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-3 bg-gray-50  border border-gray-400/20 hover:bg-gray-100 transition-colors group`}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                <div className="relative">
                  {getStoreIcon(selectedStore)}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 truncate">
                      {selectedStore.name}
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="text-left ml-3">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {selectedStore.name}
                    </p>
                    <p className="text-xs text-gray-500">Current Store</p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isStoreDropdownOpen ? 'rotate-180' : ''
                  }`} />
              )}
            </button>

            {/* Store Dropdown */}
            {isStoreDropdownOpen && !isCollapsed && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200  shadow-lg z-50">
                {error && (
                  <div className="p-3 bg-red-50 border-b border-red-200">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs">{error}</span>
                    </div>
                  </div>
                )}

                {stores.map((store) => (
                  <Link
                    key={store.slug}
                    href={`/admin/store?store=${store.slug}`}
                    className={`flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors ${store.slug === currentStore ? 'bg-indigo-50 border-l-2 border-indigo-600' : ''
                      }`}
                    onClick={() => setIsStoreDropdownOpen(false)}
                  >
                    {getStoreIcon(store)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{store.name}</p>
                      <p className="text-xs text-gray-500">/{store.slug}</p>
                    </div>
                    {store.status !== 'active' && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {store.status}
                      </span>
                    )}
                  </Link>
                ))}

                <div className="border-t border-gray-200">
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-indigo-600"
                    onClick={() => setIsStoreDropdownOpen(false)}
                  >
                    <Store className="w-4 h-4" />
                    <span className="text-sm font-medium">All Stores</span>
                  </Link>

                  <Link
                    href="/onboard"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-green-600 rounded-b-lg"
                    onClick={() => setIsStoreDropdownOpen(false)}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Create New Store</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            // More precise active state matching
            const isActive = item.href === '/admin/store'
              ? pathname === '/admin/store' || pathname.startsWith('/admin/store?')
              : pathname.startsWith(item.href);
            return (
              <li key={item.label}>
                <Link
                  href={`${item.href}?store=${currentStore}`}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-3 rounded-lg transition-colors group relative ${isActive
                    ? 'bg-indigo-50 border-l-2 border-indigo-600 text-indigo-700'
                    : 'hover:bg-gray-100'
                    }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${isActive
                    ? 'text-indigo-600'
                    : 'text-gray-600 group-hover:text-gray-900'
                    }`} />
                  {isCollapsed ? (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  ) : (
                    <span className={`font-medium transition-colors ${isActive
                      ? 'text-indigo-700'
                      : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2  hover:bg-gray-100 transition-colors group relative"
        >
          {isCollapsed ? (
            <>
              <ChevronRight className="w-5 h-5 text-gray-600" />
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Expand sidebar
              </div>
            </>
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white  shadow-md border border-gray-200"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">SolStore</span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1  hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-full">
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-[100px]' : 'w-72'
        }`}>
        <SidebarContent />
      </div>
    </>
  );
}