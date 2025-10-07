"use client";
import React, { useState } from 'react';
import { X, Package, PackagePlus, Star, Share2, Heart, Minus, Plus } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  category: string | null;
  stock: number | "unlimited";
  images: string[];
  status: "active" | "draft" | "inactive";
  sales: number;
  revenue: string;
}

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow?: (product: Product, quantity: number) => void;
  storeSlug: string;
}

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  storeSlug
}: ProductDetailsModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(product, quantity);
      onClose();
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      if (product.stock === 'unlimited' || newQuantity <= product.stock) {
        setQuantity(newQuantity);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || `Check out ${product.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 truncate">Product Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Images Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImageIndex === index
                          ? 'border-indigo-500'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              {/* Title and Category */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {product.category && (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <Image
                  src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAASFBMVEVHcExYmddlgeAu1r5Irc5Hrc2JU/WKVPYj6q1reeMl5bOJUfWUSP0k5rNQndRcjdsd9KU4xsR9YO5pfOIt2b1DtctJqs9ybugVOp/+AAAAC3RSTlMAHE9DQ09NMjJDT2HHxPcAAACSSURBVCiRxdDBDoMgEEVRUMtUoFpB5f//tIPTyJOkpJumd3uCPlDqf+l7Fdiwbcuyrg/uKRWlad+vWkzPEyqzLRbnSosp3XE3yeZwTTszHg25nsOT5EJIUX4sV7JN7T+ojMYvG+dCSqgaz75HySqehdiMzFF3vgecNN7lYLQG4y5ajLyvlGo7NcUR11R9fY0f9AL+uBAN6GmI1QAAAABJRU5ErkJggg=='}
                  height={24}
                  width={24}
                  alt='Solana currency'
                  className="w-6 h-6"
                />
                <span className="text-3xl font-bold text-gray-900">
                  {product.price} {product.currency}
                </span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.stock === 'unlimited' ? (
                  <span className="text-green-600 text-sm font-medium">✓ In Stock</span>
                ) : product.stock > 0 ? (
                  <span className="text-green-600 text-sm font-medium">
                    ✓ {product.stock} in stock
                  </span>
                ) : (
                  <span className="text-red-600 text-sm font-medium">✗ Out of Stock</span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Sales Info */}
              {product.sales > 0 && (
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {product.sales} sold
                  </span>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={product.stock !== 'unlimited' && quantity >= product.stock}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock !== 'unlimited' && product.stock <= 0}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <PackagePlus className="w-5 h-5" />
                    Add {quantity} to Cart
                  </button>
                  
                  {onBuyNow && (
                    <button
                      onClick={handleBuyNow}
                      disabled={product.stock !== 'unlimited' && product.stock <= 0}
                      className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      <PackagePlus className="w-5 h-5" />
                      Buy Now - {quantity} item{quantity > 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}