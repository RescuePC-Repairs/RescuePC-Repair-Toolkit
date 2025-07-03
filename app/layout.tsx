import type { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import './globals.css';

// Professional metadata with SEO optimization
export const metadata: Metadata = {
  title: 'RescuePC Repairs - Professional Multi-Platform PC Repair Toolkit',
  description: 'Professional-grade multi-platform PC repair toolkit with military-grade security.'
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
          content="camera=(), microphone=(), geolocation=(), interest-cohort=()"
        />

        {/* Professional favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Professional performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />

        {/* Professional structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'RescuePC Repairs',
              description:
                'Professional multi-platform PC repair toolkit with military-grade security',
              url: 'https://rescuepcrepairs.com',
              applicationCategory: 'UtilityApplication',
              operatingSystem: 'Windows, Linux, macOS, ChromeOS, BSD',
              softwareVersion: '2.0.0',
              author: {
                '@type': 'Organization',
                name: 'RescuePC Repairs',
                url: 'https://rescuepcrepairs.com'
              },
              publisher: {
                '@type': 'Organization',
                name: 'RescuePC Repairs',
                url: 'https://rescuepcrepairs.com'
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '1250'
              }
            })
          }}
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
      </body>
    </html>
  );
}
