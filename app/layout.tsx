// NOTE: In the app directory, use lowercase <html> and <body> only. Do NOT import Html from next/document.
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
      <body>{children}</body>
    </html>
  );
}
