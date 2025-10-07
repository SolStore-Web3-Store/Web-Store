"use client";
import { useState, useCallback } from 'react';
import { storeApi } from '@/lib/api';

export interface CheckoutSession {
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

export interface PaymentStatus {
    orderId: string;
    orderNumber: string;
    status: "pending" | "completed" | "failed";
    amount: string;
    currency: string;
    paymentURL: string;
    expiresAt: string;
    transactionSignature?: string | null;
    items: Array<{
        product: {
            id: string;
            name: string;
            price: string;
        };
        quantity: number;
        price: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export const useCheckout = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createCheckoutSession = useCallback(async (
        storeId: string,
        checkoutData: {
            productId: string;
            quantity?: number;
            customerWallet: string;
            customerEmail?: string;
            currency?: "SOL" | "USDC";
        }
    ): Promise<CheckoutSession> => {
        setIsCreating(true);
        setError(null);

        try {
            const session = await storeApi.createCheckoutSession(storeId, checkoutData);
            return session;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout session';
            setError(errorMessage);
            throw err;
        } finally {
            setIsCreating(false);
        }
    }, []);

    const getPaymentStatus = useCallback(async (
        storeId: string,
        orderId: string
    ): Promise<PaymentStatus> => {
        try {
            return await storeApi.getCheckoutStatus(storeId, orderId);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get payment status';
            setError(errorMessage);
            throw err;
        }
    }, []);

    const verifyPayment = useCallback(async (
        storeId: string,
        verificationData: {
            orderId: string;
            signature?: string;
        }
    ) => {
        try {
            return await storeApi.verifyPayment(storeId, verificationData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to verify payment';
            setError(errorMessage);
            throw err;
        }
    }, []);

    return {
        createCheckoutSession,
        getPaymentStatus,
        verifyPayment,
        isCreating,
        error,
        clearError: () => setError(null)
    };
};