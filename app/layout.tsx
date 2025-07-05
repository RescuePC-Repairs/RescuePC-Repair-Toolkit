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

// Professional metadata with SEO optimization
export const metadata: Metadata = {
  title: 'RescuePC Repairs - Professional Computer Repair Toolkit',
  description: 'Professional computer repair toolkit with advanced diagnostics, system optimization, and comprehensive repair tools.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
};

// Professional layout component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
