import {
  CheckCircle,
  Download,
  Smartphone,
  Monitor,
  Shield,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { getSession } from '@/utils/stripe';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

// Server-side payment verification
async function verifyPayment(sessionId: string | null) {
  if (!sessionId) {
    return { valid: false, error: 'No session ID provided' };
  }

  try {
    const result = await getSession(sessionId);

    if (!result.success || !result.session) {
      return { valid: false, error: 'Invalid session' };
    }

    const session = result.session;

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return { valid: false, error: 'Payment not completed' };
    }

    // Check if session is not expired (24 hours)
    const sessionAge = Date.now() - session.created * 1000;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (sessionAge > maxAge) {
      return { valid: false, error: 'Session expired' };
    }

    return {
      valid: true,
      session,
      customerEmail: session.customer_email || session.customer_details?.email,
      amount: session.amount_total ? session.amount_total / 100 : 0
    };
  } catch (error) {
    console.error('Payment verification failed:', error);
    return { valid: false, error: 'Verification failed' };
  }
}

// Static page with server-side verification
export default async function SuccessPage({
  searchParams
}: {
  searchParams: { session_id?: string };
}) {
  // Verify payment before showing success page
  const verification = await verifyPayment(searchParams.session_id || null);

  if (!verification.valid) {
    // Redirect to home page with error
    redirect('/?error=invalid_payment');
  }

  const downloadLink =
    'https://u.pcloud.link/publink/show?code=XZE6yu5ZTCRwbBmyaX7WmMTJeriiNRbHkz0V';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your license has been generated and sent to your email.
            </p>
            {verification.customerEmail && (
              <p className="text-sm text-gray-500 mt-2">
                Confirmation sent to: {verification.customerEmail}
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">Payment Verified</h4>
                <p className="text-green-700 text-sm">
                  Your payment of ${verification.amount} has been confirmed. This page is only
                  accessible to verified customers.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Download Info */}
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Download className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Download Your Software
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Your RescuePC Repairs toolkit is ready for download. This software is designed
                      for Windows PCs.
                    </p>
                    <a
                      href={downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Now
                    </a>
                  </div>
                </div>

                {/* Mobile Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Smartphone className="w-5 h-5 text-yellow-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">Mobile Device Notice</h4>
                      <p className="text-yellow-700 text-sm">
                        This software is designed for Windows PCs. For the best experience, please
                        download from a desktop or laptop computer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Features */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What You Get</h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Military-grade security protection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Lightning-fast PC optimization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Complete system recovery tools</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">Automatic driver management</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Next Steps:</h4>
                  <ol className="text-sm text-gray-600 space-y-1">
                    <li>1. Download the software using the button above</li>
                    <li>2. Extract the files to your desired location</li>
                    <li>3. Run the installer as Administrator</li>
                    <li>4. Enter your license key when prompted</li>
                    <li>5. Enjoy enhanced PC performance!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Email Notification */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">📧 Check Your Email</h3>
            <p className="text-blue-800 mb-4">
              We've sent you a detailed email with your license keys and download instructions.
              Please check your inbox (and spam folder) for the email from RescuePC Repairs.
            </p>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Email Subject:</strong> 🔑 Your License - RescuePC Repairs Enterprise
                Solutions
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>From:</strong> rescuepcrepair@yahoo.com
              </p>
            </div>
          </div>

          {/* Support Section */}
          <div className="text-center mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="space-y-3">
              <p className="text-gray-600">Our support team is here to help you get started.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:rescuepcrepair@yahoo.com"
                  className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Contact Support
                </a>
                <a
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
