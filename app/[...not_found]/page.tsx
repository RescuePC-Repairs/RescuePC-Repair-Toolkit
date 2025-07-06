import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function NotFoundCatchAll() {
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
