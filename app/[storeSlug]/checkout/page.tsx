'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Minus, X, Wallet, Mail, ArrowLeft, Loader2, ShoppingCart } from 'lucide-react';
import { useCart, CartItem } from '@/hooks/useCart';
import { useWallet } from '@/hooks/useWallet';
import { storeApi } from '@/lib/api';

interface CheckoutData {
    orderId: string;
    orderNumber: string;
    paymentURL: string;
    qrCode: string;
    amount: string;
    currency: string;
    reference: string;
    expiresAt: string;
    product: {
        id: string;
        name: string;
        price: string;
    };
    store: {
        id: string;
        name: string;
    };
}

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const storeSlug = params.storeSlug as string;

    const { cart, getStoreItems, updateQuantity, removeFromCart, clearCart } = useCart();
    const { isConnected, walletAddress, connectWallet, isConnecting, error: walletError } = useWallet();

    const [customerEmail, setCustomerEmail] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [storeData, setStoreData] = useState<{ id: string; name: string } | null>(null);
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartLoaded, setIsCartLoaded] = useState(false);

    // Get items for this store
    useEffect(() => {
        const storeItems = getStoreItems(storeSlug);
        setItems(storeItems);
        setIsCartLoaded(true);
        console.log('Store items for checkout:', storeItems);
    }, [storeSlug, getStoreItems, cart]);

    // Load store data
    useEffect(() => {
        const loadStoreData = async () => {
            try {
                const store = await storeApi.getStoreBySlug(storeSlug);
                setStoreData(store);
            } catch (err) {
                console.error('Failed to load store data:', err);
                setError('Failed to load store information');
            }
        };

        loadStoreData();
    }, [storeSlug]);

    // Redirect if no items (only after cart is loaded)
    useEffect(() => {
        if (isCartLoaded && items.length === 0) {
            console.log('No items in cart, redirecting to store page');
            router.push(`/${storeSlug}`);
        }
    }, [items.length, router, storeSlug, isCartLoaded]);

    const itemsTotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const total = itemsTotal;

    const formatCurrency = (amount: number, currency: string = 'SOL') => {
        return `${amount.toFixed(2)} ${currency}`;
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handlePlaceOrder = async () => {
        // Reset error state
        setError(null);

        // Validation checks
        if (!isConnected || !walletAddress) {
            setError('Please connect your wallet to continue');
            return;
        }

        if (items.length === 0) {
            setError('No items in cart');
            return;
        }

        if (!customerEmail.trim()) {
            setError('Please enter your email address');
            return;
        }

        if (!validateEmail(customerEmail.trim())) {
            setError('Please enter a valid email address');
            return;
        }

        setIsProcessing(true);

        try {
            // For now, we'll handle single item checkout
            // In a real implementation, you might want to create separate orders for each item
            const firstItem = items[0];

            // Create checkout session using the API
            const checkoutData = await createCheckoutSession(firstItem);

            // For demo purposes, we'll simulate a successful payment
            // In a real implementation, you would:
            // 1. Show the payment URL/QR code to the user
            // 2. Monitor the blockchain for payment confirmation
            // 3. Verify payment with the backend
            // 4. Then redirect to success page

            console.log('Checkout created:', checkoutData);

            // Show payment URL for demo (in production, you'd show a proper payment interface)
            if (checkoutData.paymentURL) {
                const shouldProceed = confirm(
                    `Payment URL created: ${checkoutData.paymentURL}\n\n` +
                    `Order: ${checkoutData.orderNumber}\n` +
                    `Amount: ${checkoutData.amount} ${checkoutData.currency}\n\n` +
                    'Click OK to simulate successful payment, or Cancel to abort.'
                );

                if (!shouldProceed) {
                    setIsProcessing(false);
                    return;
                }
            }

            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clear cart after successful checkout
            clearCart();

            // Redirect to success page with order details
            router.push(`/${storeSlug}/success?orderId=${checkoutData.orderId}&orderNumber=${checkoutData.orderNumber}`);

        } catch (err) {
            console.error('Checkout error:', err);
            let errorMessage = 'Failed to create checkout session';

            if (err instanceof Error) {
                errorMessage = err.message;
            }

            // Handle specific API errors
            if (errorMessage.includes('NETWORK_ERROR')) {
                errorMessage = 'Unable to connect to payment service. Please check your connection and try again.';
            } else if (errorMessage.includes('UNAUTHORIZED')) {
                errorMessage = 'Authentication failed. Please reconnect your wallet and try again.';
            } else if (errorMessage.includes('PRODUCT_OUT_OF_STOCK')) {
                errorMessage = 'This product is currently out of stock.';
            }

            setError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const createCheckoutSession = async (item: CartItem): Promise<CheckoutData> => {
        // First get store data to get store ID
        if (!storeData) {
            throw new Error('Store data not loaded');
        }

        if (!walletAddress) {
            throw new Error('Wallet not connected');
        }

        return await storeApi.createCheckoutSession(storeData.id, {
            productId: item.id,
            quantity: item.quantity,
            customerWallet: walletAddress,
            customerEmail: customerEmail.trim(),
            currency: (item.currency as "SOL" | "USDC") || 'SOL'
        });
    };

    // Show loading state while cart or store data is loading
    if (!isCartLoaded || (!storeData && !error)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">
                        {!isCartLoaded ? 'Loading cart...' : 'Loading store information...'}
                    </p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No items in cart</h2>
                    <p className="text-gray-600 mb-4">Add some items to your cart before checking out</p>
                    <button
                        onClick={() => router.push(`/${storeSlug}`)}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50  text-black">
            <div className="max-w-md mx-auto bg-white min-h-screen border border-gray-400">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <div className="text-sm text-gray-500">Checkout</div>
                            <div className="text-xl font-bold text-gray-900">
                                {storeData?.name || 'Store'}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 space-y-6 pb-24">
                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Wallet Connection Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-gray-900">Wallet Connection</h2>

                        {!isConnected ? (
                            <div className="border border-gray-300 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <Wallet className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-900">Connect Wallet</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Connect your Solana wallet to complete the purchase
                                </p>
                                <button
                                    onClick={connectWallet}
                                    disabled={isConnecting}
                                    className="w-full h-11 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    {isConnecting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <Wallet className="w-4 h-4" />
                                            Connect Phantom Wallet
                                        </>
                                    )}
                                </button>
                                {walletError && (
                                    <p className="text-red-600 text-sm mt-2">{walletError}</p>
                                )}
                            </div>
                        ) : (
                            <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <Wallet className="w-5 h-5 text-green-600" />
                                    <div>
                                        <span className="text-sm font-medium text-green-900">Wallet Connected</span>
                                        <p className="text-xs text-green-700 font-mono">
                                            {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Customer Email Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-gray-900">Customer Information</h2>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm text-gray-700">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={customerEmail}
                                    onChange={(e) => {
                                        setCustomerEmail(e.target.value);
                                        // Clear error when user starts typing
                                        if (error && error.includes('email')) {
                                            setError(null);
                                        }
                                    }}
                                    placeholder="your@email.com"
                                    className={`w-full h-11 pl-10 pr-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${error && error.includes('email')
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-purple-500'
                                        }`}
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                We&apos;ll send your purchase confirmation and download links to this email
                            </p>
                        </div>
                    </section>

                    {/* Items Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-medium text-gray-900">Order Items</h2>

                        <div className="space-y-3">
                            {items.map((item) => (
                                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                            <div className="text-sm font-semibold text-purple-600 mt-0.5">
                                                {formatCurrency(parseFloat(item.price), item.currency)}
                                            </div>
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded mt-2"
                                                />
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="h-8 w-8 -mt-1 -mr-1 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
                                        >
                                            <X className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="h-8 w-8 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm font-medium text-gray-900 w-8 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="h-8 w-8 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Order Summary */}
                    <section className="space-y-3 pt-2">
                        <h2 className="text-sm font-medium text-gray-900">Order Summary</h2>

                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Items ({items.reduce((sum, item) => sum + item.quantity, 0)})
                                </span>
                                <span className="text-gray-900 font-medium">
                                    {formatCurrency(itemsTotal, items[0]?.currency || 'SOL')}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Platform Fee</span>
                                <span className="text-gray-900 font-medium">0.00 SOL</span>
                            </div>
                            <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="text-gray-900 font-medium">
                                    {formatCurrency(itemsTotal, items[0]?.currency || 'SOL')}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Total */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-purple-600">
                                {formatCurrency(total, items[0]?.currency || 'SOL')}
                            </span>
                        </div>
                    </div>
                </main>

                {/* Footer Button */}
                <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gray-300 border-t border-gray-200">
                    <button
                        onClick={handlePlaceOrder}
                        disabled={!isConnected || isProcessing || !customerEmail.trim()}
                        className="w-full h-12 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Place Order & Pay {formatCurrency(total, items[0]?.currency || 'SOL')}
                            </>
                        )}
                    </button>

                    {!isConnected && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Connect your wallet to continue
                        </p>
                    )}

                    {isConnected && !customerEmail.trim() && (
                        <p className="text-xs text-gray-500 text-center mt-2">
                            Enter your email address to continue
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}