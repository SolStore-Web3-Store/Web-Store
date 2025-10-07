"use client";
import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export function QRCodeComponent({ 
  value, 
  size = 200, 
  className = '',
  errorCorrectionLevel = 'M'
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !value) return;

      try {
        setIsLoading(true);
        setError(null);

        await QRCode.toCanvas(canvasRef.current, value, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel
        });
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      } finally {
        setIsLoading(false);
      }
    };

    generateQR();
  }, [value, size, errorCorrectionLevel]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <div className="text-center p-4">
          <div className="text-red-500 text-sm font-medium mb-2">QR Code Error</div>
          <div className="text-gray-600 text-xs">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg"
          style={{ width: size, height: size }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`rounded-lg ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        style={{ width: size, height: size }}
      />
    </div>
  );
}

// Alternative SVG-based QR code for better scalability
export function QRCodeSVG({ 
  value, 
  size = 200, 
  className = '',
  errorCorrectionLevel = 'M'
}: QRCodeProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      if (!value) return;

      try {
        setIsLoading(true);
        setError(null);

        const dataURL = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel
        });

        setQrCodeDataURL(dataURL);
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      } finally {
        setIsLoading(false);
      }
    };

    generateQR();
  }, [value, size, errorCorrectionLevel]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <div className="text-center p-4">
          <div className="text-red-500 text-sm font-medium mb-2">QR Code Error</div>
          <div className="text-gray-600 text-xs">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <img
        src={qrCodeDataURL}
        alt="QR Code"
        width={size}
        height={size}
        className="rounded-lg"
      />
    </div>
  );
}