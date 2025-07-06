import { Inter } from 'next/font/google';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function NotFoundCatchAll({
  params
}: {
  params: { not_found: string[] };
}) {
  // Exclude static files from catch-all route
  const path = params.not_found?.join('/') || '';
  
  // List of static files that should not be caught by this route
  const staticFiles = [
    'sw.js',
    'manifest.json',
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'RescuePC-Repairs-Logo.png',
    'browserconfig.xml',
    'site.webmanifest',
    'safari-pinned-tab.svg',
    'icon.svg'
  ];

  // If the path matches a static file, return 404 instead of rendering this page
  if (staticFiles.some(file => path.includes(file))) {
    notFound();
  }

  return (
    <div
      className={`${inter.className} min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white`}
    >
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-4">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Return Home
      </Link>
    </div>
  );
}
