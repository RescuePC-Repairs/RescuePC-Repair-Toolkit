// NOTE: In the app directory, use lowercase <html> and <body> only. Do NOT import Html from next/document.
import React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
export const revalidate = 0;

// Professional metadata with SEO optimization and security
export const metadata: Metadata = {
  title: 'RescuePC Repairs - Professional Computer Repair Toolkit',
  description:
    'Professional computer repair toolkit with advanced diagnostics, system optimization, and comprehensive repair tools.',
  keywords:
    'computer repair, PC optimization, system diagnostics, malware removal, RescuePC Repairs',
  authors: [{ name: 'Tyler Keesee' }],
  creator: 'Tyler Keesee',
  publisher: 'RescuePC Repairs',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1e40af',
  colorScheme: 'dark',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico'
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rescuepcrepairs.com',
    title: 'RescuePC Repairs - Professional Computer Repair Toolkit',
    description:
      'Professional computer repair toolkit with advanced diagnostics and system optimization.',
    siteName: 'RescuePC Repairs',
    images: [
      {
        url: '/RescuePC Repairs Logo.png',
        width: 1200,
        height: 630,
        alt: 'RescuePC Repairs Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RescuePC Repairs - Professional Computer Repair Toolkit',
    description:
      'Professional computer repair toolkit with advanced diagnostics and system optimization.',
    images: ['/RescuePC Repairs Logo.png']
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code'
  }
};

// Professional layout component with security headers
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />

        {/* HTTPS Enforcement */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />

        {/* Performance and SEO */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://rescuepcrepairs.com" />

        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-512x512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'RescuePC Repairs',
              description:
                'Professional computer repair toolkit with advanced diagnostics and system optimization',
              url: 'https://rescuepcrepairs.com',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Windows',
              offers: {
                '@type': 'Offer',
                price: '49.99',
                priceCurrency: 'USD'
              },
              author: {
                '@type': 'Person',
                name: 'Tyler Keesee'
              },
              publisher: {
                '@type': 'Organization',
                name: 'RescuePC Repairs'
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Security Scripts */}
        <Script
          id="security-headers"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Force HTTPS
              if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                window.location.href = window.location.href.replace('http:', 'https:');
              }
              
              // Prevent clickjacking
              if (window.self !== window.top) {
                window.top.location = window.self.location;
              }
              
              // Disable right-click context menu (optional security)
              document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
              });
            `
          }}
        />

        {/* Main Content */}
        {children}

        {/* Analytics and Monitoring */}
        <Script
          id="analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              window.addEventListener('load', function() {
                if ('performance' in window) {
                  const perfData = performance.getEntriesByType('navigation')[0];
                  console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }
              });
            `
          }}
        />
      </body>
    </html>
  );
}
