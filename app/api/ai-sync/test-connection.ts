import { AISyncImplementation } from './implementation';

async function testAIConnection() {
  const aiSync = new AISyncImplementation();

  try {
    console.log('🔄 Testing AI Sync Connection...\n');

    // 1. Test basic connectivity
    console.log('1️⃣ Testing Basic Connectivity...');
    const syncResult = await aiSync.testSync();
    console.log('✅ Basic connectivity test passed:', syncResult);

    // 2. Test license operations
    console.log('\n2️⃣ Testing License Operations...');
    const testLicenseKey = 'TEST_LICENSE_001';
    const testPcId = 'TEST_PC_001';

    const activationResult = await aiSync.activateLicense(testLicenseKey, testPcId);
    console.log('✅ License activation test passed:', activationResult);

    const deactivationResult = await aiSync.deactivateLicense(testLicenseKey, testPcId);
    console.log('✅ License deactivation test passed:', deactivationResult);

    // 3. Test payment verification
    console.log('\n3️⃣ Testing Payment Verification...');
    const testPaymentId = 'pi_test_payment_001';
    const paymentResult = await aiSync.verifyPayment(testPaymentId);
    console.log('✅ Payment verification test passed:', paymentResult);

    // 4. Test email delivery
    console.log('\n4️⃣ Testing Email Delivery Status...');
    const testEmailId = 'email_test_001';
    const emailResult = await aiSync.checkEmailDelivery(testEmailId);
    console.log('✅ Email delivery test passed:', emailResult);

    // 5. Test webhook health
    console.log('\n5️⃣ Testing Webhook Health...');
    const webhookResult = await aiSync.checkWebhookHealth('stripe_webhook');
    console.log('✅ Webhook health test passed:', webhookResult);

    console.log('\n🎉 All tests completed successfully!');

    // Start automated health checks
    console.log('\n🔄 Starting automated health checks (1-hour interval)...');
    aiSync.startHealthCheck();
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testAIConnection();
}
