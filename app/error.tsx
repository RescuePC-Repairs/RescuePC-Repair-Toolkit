'use client';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">500 - Internal Server Error</h1>
      <p className="mb-4">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Retry
      </button>
    </div>
  );
}
