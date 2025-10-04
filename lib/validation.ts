// Form validation utilities
export const validation = {
  storeName: (name: string): string | null => {
    if (!name.trim()) return 'Store name is required';
    if (name.length < 2) return 'Store name must be at least 2 characters';
    if (name.length > 255) return 'Store name must be less than 255 characters';
    return null;
  },

  storeSlug: (slug: string): string | null => {
    if (!slug.trim()) return 'Store slug is required';
    if (slug.length < 2) return 'Store slug must be at least 2 characters';
    if (slug.length > 100) return 'Store slug must be less than 100 characters';
    if (!/^[a-z0-9-]+$/.test(slug)) return 'Store slug can only contain lowercase letters, numbers, and hyphens';
    if (slug.startsWith('-') || slug.endsWith('-')) return 'Store slug cannot start or end with a hyphen';
    if (slug.includes('--')) return 'Store slug cannot contain consecutive hyphens';
    return null;
  },

  walletAddress: (address: string): string | null => {
    if (!address) return 'Wallet address is required';
    if (address.length < 32 || address.length > 44) return 'Invalid wallet address length';
    if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(address)) return 'Invalid wallet address format';
    return null;
  },

  fileSize: (file: File, maxSizeMB: number): string | null => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) return `File size must be less than ${maxSizeMB}MB`;
    return null;
  },

  fileType: (file: File, allowedTypes: string[]): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `File type must be one of: ${allowedTypes.join(', ')}`;
    }
    return null;
  },
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const truncateAddress = (address: string, chars: number = 8): string => {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};