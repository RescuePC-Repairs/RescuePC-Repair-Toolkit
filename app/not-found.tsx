import Link from 'next/link';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <a href="/" className="text-blue-500 underline">Return Home</a>
    </div>
  );
}
