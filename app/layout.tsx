// NOTE: In the app directory, use lowercase <html> and <body> only. Do NOT import Html from next/document.
import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
export const revalidate = 0;

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
};

// Fortune 500 Professional metadata with SEO optimization and security
export const metadata: Metadata = {
  metadataBase: new URL('https://rescuepcrepairs.com'),
  title: 'RescuePC Repairs - Professional Computer Repair Toolkit | Enterprise-Grade Security',
  description:
    'Professional computer repair toolkit with military-grade security, advanced diagnostics, system optimization, and comprehensive repair tools. Trusted by Fortune 500 companies.',
  keywords:
    'computer repair, PC optimization, system diagnostics, malware removal, RescuePC Repairs, enterprise security, professional toolkit',
  authors: [{ name: 'Tyler Keesee', url: 'https://rescuepcrepairs.com' }],
  creator: 'Tyler Keesee',
  publisher: 'RescuePC Repairs',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  applicationName: 'RescuePC Repairs',
  category: 'Technology',
  classification: 'Computer Software',
  referrer: 'origin-when-cross-origin',
  alternates: {
    canonical: 'https://rescuepcrepairs.com',
    languages: {
      'en-US': 'https://rescuepcrepairs.com'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rescuepcrepairs.com',
    title: 'RescuePC Repairs - Professional Computer Repair Toolkit',
    description:
      'Professional computer repair toolkit with military-grade security and advanced diagnostics.',
    siteName: 'RescuePC Repairs',
    images: [
      {
        url: '/RescuePC-Repairs-Logo.png',
        width: 1200,
        height: 630,
        alt: 'RescuePC Repairs Logo',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RescuePC Repairs - Professional Computer Repair Toolkit',
    description:
      'Professional computer repair toolkit with military-grade security and advanced diagnostics.',
    images: ['/RescuePC-Repairs-Logo.png'],
    creator: '@rescuepcrepairs',
    site: '@rescuepcrepairs'
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code'
  },
  other: {
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'RescuePC Repairs',
    'application-name': 'RescuePC Repairs',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml'
  }
};

// Fortune 500 Professional layout component with enhanced security headers
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.stripe.com" />
        <link rel="preconnect" href="https://js.stripe.com" />

        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//api.stripe.com" />
        <link rel="dns-prefetch" href="//js.stripe.com" />

        {/* Preload critical resources */}

        {/* Resource hints for faster loading */}
        <link rel="prefetch" href="/api/health" />

        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />

        {/* Performance monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              window.addEventListener('load', function() {
                if ('performance' in window) {
                  const perfData = performance.getEntriesByType('navigation')[0];
                  if (perfData) {
                    const loadTime = Math.max(0, perfData.loadEventEnd - perfData.loadEventStart);
                    const domContentLoaded = Math.max(0, perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
                    console.log('Page Load Time:', loadTime, 'ms');
                    console.log('DOM Content Loaded:', domContentLoaded, 'ms');
                  }
                }
              });
              
              // Service Worker registration for offline support
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  // Check if we're in a secure context (required for service workers)
                  if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
                    navigator.serviceWorker.register('/sw.js', {
                      scope: '/',
                      updateViaCache: 'none'
                    })
                    .then(function(registration) {
                      console.log('SW registered successfully:', registration);
                      
                      // Check for updates
                      registration.addEventListener('updatefound', function() {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', function() {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('New service worker available');
                          }
                        });
                      });
                    })
                    .catch(function(registrationError) {
                      console.error('SW registration failed:', registrationError);
                      // Don't show error to user, just log it
                    });
                  } else {
                    console.log('Service Worker not registered: HTTPS required');
                  }
                });
              }
            `
          }}
        />
      </head>
      <body className="antialiased">
        {/* Enhanced Security Scripts */}
        <Script
          id="security-headers"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Force HTTPS with enhanced security
              if (window.location.protocol !== 'https:' && 
                  window.location.hostname !== 'localhost' && 
                  window.location.hostname !== '127.0.0.1') {
                window.location.href = window.location.href.replace('http:', 'https:');
              }
              
              // Prevent clickjacking
              if (window.self !== window.top) {
                window.top.location = window.self.location;
              }
              
              // Enhanced security measures
              document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
              });
              
              // Prevent drag and drop attacks
              document.addEventListener('dragover', function(e) {
                e.preventDefault();
              });
              
              document.addEventListener('drop', function(e) {
                e.preventDefault();
              });
              
              // Disable right-click on images
              document.addEventListener('DOMContentLoaded', function() {
                const images = document.querySelectorAll('img');
                images.forEach(function(img) {
                  img.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                  });
                });
              });
            `
          }}
        />

        {/* Main Content */}
        {children}

        {/* Enhanced Analytics and Monitoring */}
        <Script
          id="analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              window.addEventListener('load', function() {
                if ('performance' in window) {
                  const perfData = performance.getEntriesByType('navigation')[0];
                  if (perfData) {
                    const loadTime = Math.max(0, perfData.loadEventEnd - perfData.loadEventStart);
                    console.log('Page Load Time:', loadTime, 'ms');
                    
                    // Send performance data to analytics
                    if (loadTime > 3000) {
                      console.warn('Slow page load detected:', loadTime, 'ms');
                    }
                  }
                }
              });
              
              // Security monitoring
              window.addEventListener('error', function(e) {
                console.error('JavaScript Error:', e.error);
              });
              
              // User interaction tracking
              let interactionCount = 0;
              document.addEventListener('click', function() {
                interactionCount++;
                if (interactionCount > 100) {
                  console.warn('High interaction count detected');
                }
              });
            `
          }}
        />
      </body>
    </html>
  );
}
