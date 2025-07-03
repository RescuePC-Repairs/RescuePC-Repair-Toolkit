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
    <div style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: '#111827',
      color: '#ffffff',
      margin: 0,
      padding: 0
    }}>
      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
        {children}
      </Suspense>
    </div>
  );
}
