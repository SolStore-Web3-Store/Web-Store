"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/ui/sidebar';
import { storeApi, uploadApi, ApiError } from '@/lib/api';
import { useWallet } from '@/hooks/useWallet';
import { WalletConnectButtonMini } from '@/components/wallet/wallet-connect-button-mini';
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
  CheckCircle,
  AlertCircle,
  Loader2,
  Wallet,
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

interface StoreApiSettings {
  currency?: string;
  language?: string;
  timezone?: string;
  theme?: string;
  notifications?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
  privacy?: {
    storeVisible?: boolean;
    requireLogin?: boolean;
  };
}

interface StoreApiResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  banner?: string;
  settings: StoreApiSettings;
  owner: {
    walletAddress: string;
  };
}

interface StoreSettings {
  id?: string;
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

interface SaveStatus {
  type: 'success' | 'error' | 'loading' | null;
  message: string;
}

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

function StoreSettingsContent() {
  const searchParams = useSearchParams();
  const currentStore = searchParams.get('store') || undefined;
  const { isConnected, walletAddress } = useWallet();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ type: null, message: '' });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: '',
    storeDescription: '',
    storeUrl: '',
    storeLogo: '',
    storeBanner: '',
    currency: 'SOL',
    language: 'English',
    timezone: 'UTC',
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

  // Load store data on component mount
  useEffect(() => {
    const loadStoreData = async () => {
      if (!currentStore || !isConnected) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const storeData = await storeApi.getStoreBySlug(currentStore) as StoreApiResponse;

        setSettings({
          id: storeData.id,
          storeName: storeData.name || '',
          storeDescription: storeData.description || '',
          storeUrl: storeData.slug || '',
          storeLogo: storeData.icon || '',
          storeBanner: storeData.banner || '',
          currency: storeData.settings?.currency || 'SOL',
          language: storeData.settings?.language || 'English',
          timezone: storeData.settings?.timezone || 'UTC',
          theme: storeData.settings?.theme || 'light',
          notifications: {
            email: storeData.settings?.notifications?.email ?? true,
            sms: storeData.settings?.notifications?.sms ?? false,
            push: storeData.settings?.notifications?.push ?? true,
          },
          privacy: {
            storeVisible: storeData.settings?.privacy?.storeVisible ?? true,
            requireLogin: storeData.settings?.privacy?.requireLogin ?? false,
          },
        });
      } catch (error) {
        console.error('Error loading store data:', error);
        setSaveStatus({
          type: 'error',
          message: error instanceof ApiError ? error.message : 'Failed to load store data'
        });
      } finally {
        setLoading(false);
      }
    };

    loadStoreData();
  }, [currentStore, isConnected]);

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

  const handleSave = async (): Promise<void> => {
    if (!settings.id || !isConnected) {
      setSaveStatus({
        type: 'error',
        message: 'Store ID not found or wallet not connected'
      });
      return;
    }

    try {
      setSaveStatus({ type: 'loading', message: 'Saving changes...' });

      await storeApi.updateStore(settings.id, {
        name: settings.storeName,
        description: settings.storeDescription,
        iconUrl: settings.storeLogo,
        bannerUrl: settings.storeBanner,
        settings: {
          currency: settings.currency,
          language: settings.language,
          timezone: settings.timezone,
          theme: settings.theme,
          notifications: settings.notifications,
          privacy: settings.privacy,
        }
      });

      setSaveStatus({
        type: 'success',
        message: 'Settings saved successfully!'
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ type: null, message: '' });
      }, 3000);

    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({
        type: 'error',
        message: error instanceof ApiError ? error.message : 'Failed to save settings'
      });
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const result = await uploadApi.uploadStoreIcon(file);
      setSettings(prev => ({ ...prev, storeLogo: result.url }));
      setSaveStatus({
        type: 'success',
        message: 'Logo uploaded successfully!'
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      setSaveStatus({
        type: 'error',
        message: error instanceof ApiError ? error.message : 'Failed to upload logo'
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingBanner(true);
      const result = await uploadApi.uploadStoreBanner(file);
      setSettings(prev => ({ ...prev, storeBanner: result.url }));
      setSaveStatus({
        type: 'success',
        message: 'Banner uploaded successfully!'
      });
    } catch (error) {
      console.error('Error uploading banner:', error);
      setSaveStatus({
        type: 'error',
        message: error instanceof ApiError ? error.message : 'Failed to upload banner'
      });
    } finally {
      setUploadingBanner(false);
    }
  };

  // Check if all required General Information fields are filled
  const isGeneralInfoComplete = (): boolean => {
    return !!(
      settings.storeName.trim() &&
      settings.storeDescription.trim() &&
      settings.storeLogo &&
      settings.storeBanner
    );
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
    <div className="flex h-screen bg-gray-50 text-black">
      <Sidebar currentStore={currentStore} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Store Settings</h1>
              <p className="text-xs text-gray-600 mt-1">Manage your store configuration and preferences</p>
            </div>
            <div className="flex items-center gap-3">
            {isGeneralInfoComplete() && <p className='text-xs'> Pls fill all fields</p>}
              {/* Save Status */}

              {saveStatus.type && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${saveStatus.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : saveStatus.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                  {saveStatus.type === 'success' && <CheckCircle className="w-4 h-4" />}
                  {saveStatus.type === 'error' && <AlertCircle className="w-4 h-4" />}
                  {saveStatus.type === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
               
                  {saveStatus.message}
                </div>
              )}

              {/* Only show save button when General Information is complete or not on general tab */}
              {(activeTab !== 'general' || isGeneralInfoComplete()) && (
                <button
                  onClick={handleSave}
                  disabled={saveStatus.type === 'loading' || !isConnected}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveStatus.type === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              )}
            </div>
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
                      className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg transition-colors ${activeTab === tab.id
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
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading store settings...</p>
                  </div>
                </div>
              ) : !isConnected ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Wallet Not Connected</h3>
                  <p className="text-gray-600">Please connect your wallet to manage store settings.</p>
                </div>
              ) : !currentStore ? (
                <div className="text-center py-12">
                  <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Store Selected</h3>
                  <p className="text-gray-600">Please select a store to manage its settings.</p>
                </div>
              ) : (
                <>
                  {/* General Settings */}
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">General Information</h2>
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
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
                            <label className="block text-xs font-medium text-gray-700 mb-2">
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
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              Store URL
                            </label>
                            <input
                              type="text"
                              value={settings.storeUrl}
                              onChange={(e) => handleInputChange('storeUrl', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                              placeholder="your-store-name"
                              disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Your store is available at: {typeof window !== 'undefined' ? window.location.origin : 'https://yoursite.com'}/{settings.storeUrl}
                            </p>
                            <p className="text-xs text-yellow-600 mt-1">
                              Store URL cannot be changed after creation
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Store Branding</h2>
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              Store Logo
                            </label>
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {settings.storeLogo ? (
                                  <img
                                    src={settings.storeLogo}
                                    alt="Store Logo"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Store className="w-8 h-8 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <input
                                  type="file"
                                  id="logo-upload"
                                  accept="image/*"
                                  onChange={handleLogoUpload}
                                  className="hidden"
                                />
                                <label
                                  htmlFor="logo-upload"
                                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                                >
                                  {uploadingLogo ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Upload className="w-4 h-4" />
                                  )}
                                  {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                                </label>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              Store Banner
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                              {settings.storeBanner ? (
                                <div className="relative">
                                  <img
                                    src={settings.storeBanner}
                                    alt="Store Banner"
                                    className="w-full h-32 object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <input
                                      type="file"
                                      id="banner-upload"
                                      accept="image/*"
                                      onChange={handleBannerUpload}
                                      className="hidden"
                                    />
                                    <label
                                      htmlFor="banner-upload"
                                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg cursor-pointer"
                                    >
                                      {uploadingBanner ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Upload className="w-4 h-4" />
                                      )}
                                      {uploadingBanner ? 'Uploading...' : 'Change Banner'}
                                    </label>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-8 text-center">
                                  <input
                                    type="file"
                                    id="banner-upload-empty"
                                    accept="image/*"
                                    onChange={handleBannerUpload}
                                    className="hidden"
                                  />
                                  <label
                                    htmlFor="banner-upload-empty"
                                    className="cursor-pointer block"
                                  >
                                    {uploadingBanner ? (
                                      <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
                                    ) : (
                                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    )}
                                    <p className="text-xs text-gray-600">
                                      {uploadingBanner ? 'Uploading banner...' : 'Click to upload banner image'}
                                    </p>
                                    <p className="text-xs text-gray-500">Recommended size: 1200x400px</p>
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Appearance Settings */}
                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <div className=""> </div>
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Theme & Appearance</h2>
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
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
                                  <div className="text-xs text-gray-500">
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
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              Currency
                            </label>
                            <select
                              value={settings.currency}
                              onChange={(e) => handleInputChange('currency', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="SOL">Solana (SOL)</option>
                            
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-2">
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
                            <label className="block text-xs font-medium text-gray-700 mb-2">
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
                              <div className="text-xs text-gray-500">Receive notifications via email</div>
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
                              <div className="text-xs text-gray-500">Receive notifications via SMS</div>
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
                              <div className="text-xs text-gray-500">Receive browser push notifications</div>
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
                              <div className="text-xs text-gray-500">Make your store publicly visible</div>
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
                              <div className="text-xs text-gray-500">Customers must login to view products</div>
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
                        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">

                          {/* Solana Wallet Section */}
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Solana Wallet</h3>
                                <p className="text-xs text-gray-600">Connect your Phantom wallet to receive SOL payments</p>
                              </div>
                            </div>

                            <div className="max-w-md">
                              <WalletConnectButtonMini
                                onSuccess={(address: string) => {
                                  console.log('Wallet connected for payments:', address);
                                }}
                                onError={(error: string) => {
                                  console.error('Wallet connection error:', error);
                                }}
                              />
                            </div>

                            {isConnected && walletAddress && (
                              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-medium text-blue-900">Payment Wallet Connected</p>
                                    <p className="text-xs text-blue-700 mt-1">
                                      Your store will receive SOL payments directly to this wallet address.
                                    </p>
                                    <p className="text-xs font-mono text-blue-600 mt-2">
                                      {walletAddress}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Payment Settings */}
                          <div className="border-t border-gray-200 pt-6">
                            <h4 className="text-md font-medium text-gray-900 mb-4">Payment Configuration</h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  Accepted Currency
                                </label>
                                <select
                                  value={settings.currency}
                                  onChange={(e) => handleInputChange('currency', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="SOL">Solana (SOL)</option>
                                 
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                  Choose the cryptocurrency your customers will pay with
                                </p>
                              </div>

                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-medium text-yellow-800">Important Security Note</p>
                                    <p className="text-xs text-yellow-700 mt-1">
                                      Payments are sent directly to your connected wallet. Make sure you control this wallet and keep your private keys secure.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Additional Payment Methods */}
                          <div className="border-t border-gray-200 pt-6">
                            <h4 className="text-md font-medium text-gray-900 mb-4">Additional Payment Methods</h4>
                            <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                              <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-xs text-gray-600 mb-2">More payment methods coming soon</p>
                              <p className="text-xs text-gray-500">Credit cards, PayPal, and other cryptocurrencies</p>
                            </div>
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
                </>
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