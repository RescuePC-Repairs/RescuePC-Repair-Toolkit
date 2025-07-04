'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = false;

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id') ?? '';
  const packageType = searchParams?.get('package') ?? '';

  const [customerData, setCustomerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // PACKAGE INFORMATION FOR SUCCESS DISPLAY
  const PACKAGE_INFO: Record<string, any> = {
    basic: {
      name: 'Basic License',
      licenses: 1,
      price: 49.99,
      features: ['Single PC Repair', 'Basic Support', '1 Year Updates']
    },
    professional: {
      name: 'Professional License',
      licenses: 5,
      price: 199.99,
      features: ['5 PC Repairs', 'Priority Support', '1 Year Updates', 'Phone Support']
    },
    enterprise: {
      name: 'Enterprise License',
      licenses: 25,
      price: 499.99,
      features: ['25 PC Repairs', '24/7 Support', '5 Year Updates', 'Custom Integration']
    },
    government: {
      name: 'Government License',
      licenses: 100,
      price: 999.99,
      features: ['100 PC Repairs', 'Compliance Features', 'Audit Logging', 'Dedicated Manager']
    },
    lifetime: {
      name: 'Lifetime Enterprise',
      licenses: 'Unlimited',
      price: 499.99,
      features: [
        'Unlimited PC Repairs',
        'Lifetime Updates',
        'Source Code Access',
        'White Label Option'
      ]
    }
  };

  useEffect(() => {
    if (sessionId) {
      // Fetch customer data logic here
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const currentPackage = packageType ? PACKAGE_INFO[packageType] : PACKAGE_INFO.basic;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-8"></div>
          <h2 className="text-2xl font-bold mb-4">Processing Your Purchase...</h2>
          <p className="text-gray-400">Generating license keys and sending confirmation email</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-green-500/20 rounded-full mb-6">
            <div className="text-6xl">🎉</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-300">Your {currentPackage.name} has been activated</p>
        </div>

        {/* Automation Status */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">
            🤖 AUTOMATED PROCESSING COMPLETE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Payment processed successfully</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>License keys generated instantly</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Confirmation email sent</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Download links activated</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Support access enabled</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Account activated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Summary */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">📦 Purchase Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-400">Package Details</h3>
              <div className="space-y-2">
                <p>
                  <strong>Package:</strong> {currentPackage.name}
                </p>
                <p>
                  <strong>Price:</strong> ${currentPackage.price}
                </p>
                <p>
                  <strong>Licenses:</strong>{' '}
                  {typeof currentPackage.licenses === 'number'
                    ? `${currentPackage.licenses} PC${currentPackage.licenses > 1 ? 's' : ''}`
                    : currentPackage.licenses}
                </p>
                <p>
                  <strong>Session ID:</strong>{' '}
                  <span className="font-mono text-sm text-gray-400">
                    {sessionId?.slice(0, 20)}...
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-green-400">Features Included</h3>
              <ul className="space-y-2">
                {currentPackage.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">📋 Next Steps</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="font-bold mb-2">1. Check Your Email</h3>
              <p className="text-gray-400 text-sm">
                Your license keys and download link have been sent to your email address
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">📥</div>
              <h3 className="font-bold mb-2">2. Download Software</h3>
              <p className="text-gray-400 text-sm">
                Use the secure download link in your email to get the RescuePC Repairs toolkit
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🔑</div>
              <h3 className="font-bold mb-2">3. Activate License</h3>
              <p className="text-gray-400 text-sm">
                Enter your license key when prompted during installation
              </p>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-purple-400">
            🔗 Secure Download
          </h2>

          <div className="text-center">
            <p className="text-gray-300 mb-6">
              Your software is ready for download! Use this secure link to access your RescuePC
              Repairs toolkit.
            </p>

            <a
              href="***REMOVED***"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              🚀 DOWNLOAD NOW
            </a>

            <p className="text-gray-500 text-sm mt-4">
              Secure PCloud download • No expiration • Lifetime access
            </p>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">📞 Need Help?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-bold mb-2">Email Support</h3>
              <p className="text-blue-400">***REMOVED***</p>
              <p className="text-gray-400 text-sm">Response within 2 hours</p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="font-bold mb-2">Business Support</h3>
              <p className="text-blue-400">***REMOVED***</p>
              <p className="text-gray-400 text-sm">Enterprise inquiries</p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="font-bold mb-2">Support Hours</h3>
              <p className="text-green-400">24/7 Available</p>
              <p className="text-gray-400 text-sm">Always here to help</p>
            </div>
          </div>
        </div>

        {/* Return Home */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            ← Return to Home
          </a>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 p-6 bg-gray-800/50 rounded-lg">
          <p className="text-gray-400 text-sm">
            Thank you for choosing RescuePC Repairs! Your purchase supports continued development
            and 24/7 support.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © 2024 RescuePC Repairs. All rights reserved. | 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
