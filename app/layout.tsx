import React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import './globals.css';

// Professional metadata with SEO optimization
export const metadata: Metadata = {
  title: 'RescuePC Repairs - Professional Multi-Platform PC Repair Toolkit',
  description: 'Professional-grade multi-platform PC repair toolkit with military-grade security.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
};

// Professional layout component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Professional security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta
          httpEquiv="Permissions-Policy"
          content="camera=(), microphone=(), geolocation=(), payment=()"
        />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://checkout.stripe.com wss://ws.stripe.com https://vercel.live; frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com;"
        />
      </head>
      <body
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          backgroundColor: '#111827',
          color: '#ffffff',
          margin: 0,
          padding: 0
        }}
      >
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
          {children}
        </Suspense>
        <Script src="https://js.stripe.com/v3/" strategy="lazyOnload" />
      </body>
    </html>
  );
}
