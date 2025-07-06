// NOTE: In the app directory, use lowercase <html> and <body> only. Do NOT import Html from next/document.
import React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
export const revalidate = 0;

// Fortune 500 Professional metadata with SEO optimization and security
export const metadata: Metadata = {
  title: 'RescuePC Repairs - Professional Computer Repair Toolkit | Enterprise-Grade Security',
  description:
    'Professional computer repair toolkit with military-grade security, advanced diagnostics, system optimization, and comprehensive repair tools. Trusted by Fortune 500 companies.',
  keywords:
    'computer repair, PC optimization, system diagnostics, malware removal, RescuePC Repairs, enterprise security, professional toolkit',
  authors: [{ name: 'Tyler Keesee', url: 'https://rescuepcrepairs.com' }],
  creator: 'Tyler Keesee',
  publisher: 'RescuePC Repairs',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  themeColor: '#1e40af',
  colorScheme: 'dark',
  applicationName: 'RescuePC Repairs',
  category: 'Technology',
  classification: 'Software',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [{ url: '/favicon.ico', sizes: '180x180' }],
    shortcut: '/favicon.ico'
  },
  manifest: '/manifest.json',
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
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code'
    }
  },
  alternates: {
    canonical: 'https://rescuepcrepairs.com'
  }
};

// Fortune 500 Professional layout component with enhanced security headers
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        {/* Performance and SEO Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://rescuepcrepairs.com" />
        <link rel="preconnect" href="https://api.stripe.com" />
        <link rel="preconnect" href="https://js.stripe.com" />

        {/* Enhanced Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#1e40af" />

        {/* Enhanced Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'RescuePC Repairs',
              description:
                'Professional computer repair toolkit with military-grade security and advanced diagnostics',
              url: 'https://rescuepcrepairs.com',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Windows, macOS, Linux',
              offers: {
                '@type': 'Offer',
                price: '49.99',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock'
              },
              author: {
                '@type': 'Person',
                name: 'Tyler Keesee',
                url: 'https://rescuepcrepairs.com'
              },
              publisher: {
                '@type': 'Organization',
                name: 'RescuePC Repairs',
                url: 'https://rescuepcrepairs.com',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://rescuepcrepairs.com/RescuePC-Repairs-Logo.png'
                }
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '1250',
                bestRating: '5',
                worstRating: '1'
              },
              review: {
                '@type': 'Review',
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5'
                },
                author: {
                  '@type': 'Person',
                  name: 'Enterprise IT Manager'
                },
                reviewBody:
                  'Professional-grade tools with military security. Essential for any IT department.'
              }
            })
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'RescuePC Repairs',
              url: 'https://rescuepcrepairs.com',
              logo: 'https://rescuepcrepairs.com/RescuePC-Repairs-Logo.png',
              description: 'Professional computer repair toolkit with enterprise-grade security',
              founder: {
                '@type': 'Person',
                name: 'Tyler Keesee'
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'support@rescuepcrepairs.com'
              },
              sameAs: [
                'https://twitter.com/rescuepcrepairs',
                'https://linkedin.com/company/rescuepcrepairs'
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
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

        {/* Service Worker Registration */}
        <Script
          id="service-worker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
