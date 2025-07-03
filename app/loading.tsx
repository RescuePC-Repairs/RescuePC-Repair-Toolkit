export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Loading RescuePC Repairs</h2>
        <p className="text-gray-400">Please wait while we prepare your experience...</p>
      </div>
    </div>
  );
}
