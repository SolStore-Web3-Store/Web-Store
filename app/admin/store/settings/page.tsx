"use client";
import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/ui/sidebar';
import {
  Save,
  Upload,
  Store,
  Globe,
  Palette,
  Bell,
  Shield,
  CreditCard,
  Users,
  LucideIcon,
} from 'lucide-react';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface PrivacySettings {
  storeVisible: boolean;
  requireLogin: boolean;
}

interface StoreSettings {
  storeName: string;
  storeDescription: string;
  storeUrl: string;
  storeLogo: string;
  storeBanner: string;
  currency: string;
  language: string;
  timezone: string;
  theme: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

function StoreSettingsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: '',
    storeDescription: '',
    storeUrl: '',
    storeLogo: '',
    storeBanner: '',
    currency: 'NGN',
    language: 'English',
    timezone: 'Africa/Lagos',
    theme: 'light',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    privacy: {
      storeVisible: true,
      requireLogin: false,
    },
  });

  const handleInputChange = (field: keyof StoreSettings, value: string): void => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (
    parent: 'notifications' | 'privacy',
    field: string,
    value: boolean
  ): void => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSave = (): void => {
    // Save settings logic here
    console.log('Saving settings:', settings);
  };

  const tabs: Tab[] = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'localization', label: 'Localization', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'users', label: 'Users & Permissions', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Store Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your store configuration and preferences</p>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Settings Navigation */}
          <nav className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Settings Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">General Information</h2>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Store Name
                        </label>
                        <input
                          type="text"
                          value={settings.storeName}
                          onChange={(e) => handleInputChange('storeName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your store name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Store Description
                        </label>
                        <textarea
                          value={settings.storeDescription}
                          onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe your store"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Store URL
                        </label>
                        <input
                          type="text"
                          value={settings.storeUrl}
                          onChange={(e) => handleInputChange('storeUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="your-store-name"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Your store will be available at: takeapp.com/your-store-name
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Store Branding</h2>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Store Logo
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Store className="w-8 h-8 text-gray-400" />
                          </div>
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Upload className="w-4 h-4" />
                            Upload Logo
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Store Banner
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload banner image</p>
                          <p className="text-xs text-gray-500">Recommended size: 1200x400px</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Theme & Appearance</h2>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {(['light', 'dark'] as const).map((theme) => (
                            <button
                              key={theme}
                              onClick={() => handleInputChange('theme', theme)}
                              className={`p-4 border rounded-lg text-left transition-colors ${settings.theme === theme
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                              <div className="font-medium capitalize">{theme}</div>
                              <div className="text-sm text-gray-500">
                                {theme === 'light' ? 'Clean and bright' : 'Dark and modern'}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Localization Settings */}
              {activeTab === 'localization' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Regional Settings</h2>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          value={settings.currency}
                          onChange={(e) => handleInputChange('currency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="NGN">Nigerian Naira (₦)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                          <option value="GBP">British Pound (£)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) => handleInputChange('language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="English">English</option>
                          <option value="French">French</option>
                          <option value="Spanish">Spanish</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.timezone}
                          onChange={(e) => handleInputChange('timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Africa/Lagos">West Africa Time (WAT)</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-gray-500">Receive notifications via email</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.email}
                            onChange={(e) => handleNestedChange('notifications', 'email', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">SMS Notifications</div>
                          <div className="text-sm text-gray-500">Receive notifications via SMS</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.sms}
                            onChange={(e) => handleNestedChange('notifications', 'sms', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Push Notifications</div>
                          <div className="text-sm text-gray-500">Receive browser push notifications</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications.push}
                            onChange={(e) => handleNestedChange('notifications', 'push', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy & Security</h2>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Store Visibility</div>
                          <div className="text-sm text-gray-500">Make your store publicly visible</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.storeVisible}
                            onChange={(e) => handleNestedChange('privacy', 'storeVisible', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Require Login</div>
                          <div className="text-sm text-gray-500">Customers must login to view products</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy.requireLogin}
                            onChange={(e) => handleNestedChange('privacy', 'requireLogin', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payments Settings */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h2>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Integration</h3>
                        <p className="text-gray-600 mb-4">Connect your payment providers to start accepting payments</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                          Setup Payments
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Settings */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">User Management</h2>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Team Management</h3>
                        <p className="text-gray-600 mb-4">Invite team members and manage permissions</p>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                          Invite Users
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function StoreSettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    }>
      <StoreSettingsContent />
    </Suspense>
  );
}