import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting (in production, use Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function getRequestCount(clientIP: string): number {
  const now = Date.now();
  const minute = 60 * 1000;
  
  const record = requestCounts.get(clientIP);
  if (!record || now > record.resetTime) {
    requestCounts.set(clientIP, { count: 1, resetTime: now + minute });
    return 1;
  }
  
  record.count++;
  return record.count;
}

export function middleware(request: NextRequest) {
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    const hostname = request.headers.get('host') || '';
    const isHttps = request.headers.get('x-forwarded-proto') === 'https';
    
    if (!isHttps && !hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
      const httpsUrl = `https://${hostname}${request.nextUrl.pathname}${request.nextUrl.search}`;
      return NextResponse.redirect(httpsUrl, 301);
    }
  }

  // Rate limiting headers
  const clientIP = request.ip || (request.headers?.get('x-forwarded-for')) || 'unknown';
  const userAgent = request.headers?.get('user-agent') || '';
  
  // Bot detection and blocking
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /perl/i,
    /ruby/i,
    /php/i,
    /go-http-client/i,
    /httpclient/i,
    /okhttp/i,
    /apache-httpclient/i,
    /requests/i,
    /urllib/i,
    /mechanize/i,
    /scrapy/i,
    /selenium/i,
    /puppeteer/i,
    /playwright/i,
    /cypress/i,
    /testcafe/i,
    /headless/i,
    /phantomjs/i,
    /nightmare/i,
    /casperjs/i,
    /zombie/i,
    /dalekjs/i,
    /webdriver/i,
    /chromedriver/i,
    /geckodriver/i,
    /iedriver/i,
    /safaridriver/i,
    /edgedriver/i,
    /operadriver/i,
    /appium/i,
    /robot/i,
    /automation/i,
    /script/i,
    /macro/i,
    /auto/i,
    /cron/i,
    /scheduler/i,
    /task/i,
    /job/i,
    /worker/i,
    /daemon/i,
    /service/i,
    /agent/i,
    /monitor/i,
    /scanner/i,
    /probe/i,
    /checker/i,
    /validator/i,
    /tester/i,
    /debugger/i,
    /profiler/i,
    /analyzer/i,
    /inspector/i,
    /examiner/i,
    /auditor/i,
    /reviewer/i,
    /assessor/i,
    /evaluator/i,
    /appraiser/i,
    /estimator/i,
    /calculator/i,
    /computer/i,
    /processor/i,
    /engine/i,
    /machine/i,
    /device/i,
    /tool/i,
    /utility/i,
    /helper/i,
    /assistant/i,
    /guide/i,
    /wizard/i,
    /expert/i,
    /specialist/i,
    /consultant/i,
    /advisor/i,
    /counselor/i,
    /therapist/i,
    /doctor/i,
    /nurse/i,
    /paramedic/i,
    /technician/i,
    /engineer/i,
    /architect/i,
    /designer/i,
    /developer/i,
    /programmer/i,
    /coder/i,
    /hacker/i,
    /cracker/i,
    /phreaker/i,
    /lamer/i,
    /script kiddie/i,
    /newbie/i,
    /noob/i,
    /n00b/i,
    /l33t/i,
    /h4x0r/i,
    /w4r3z/i,
    /c0d3r/i,
    /pr0gr4mm3r/i,
    /h4ck3r/i,
    /cr4ck3r/i,
    /phr34k3r/i,
    /l4m3r/i,
    /n3wb13/i,
    /n00b13/i,
    /l33t13/i,
    /h4x0r13/i,
    /w4r3z13/i,
    /c0d3r13/i,
    /pr0gr4mm3r13/i,
    /h4ck3r13/i,
    /cr4ck3r13/i,
    /phr34k3r13/i,
    /l4m3r13/i,
  ];

  const isSuspiciousBot = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  
  if (isSuspiciousBot) {
    // Log suspicious activity
    console.log(`🚨 Suspicious bot detected: ${userAgent} from ${clientIP}`);
    
    // Return 403 Forbidden for suspicious bots
    return new NextResponse('Access Denied', { status: 403 });
  }

  // DDoS protection - simple rate limiting
  const requestCount = getRequestCount(clientIP);
  if (requestCount > 100) { // 100 requests per minute
    console.log(`🚨 Rate limit exceeded: ${clientIP}`);
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // CSRF protection for POST requests
  if (request.method === 'POST') {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    if (!origin || !referer) {
      console.log(`🚨 CSRF attempt detected: ${clientIP}`);
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // Validate origin matches expected domain
    const allowedOrigins = [
      'https://rescuepcrepairs.com',
      'https://www.rescuepcrepairs.com',
      'https://***REMOVED***',
      'http://localhost:3000' // Allow localhost for testing
    ];
    
    if (!allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      console.log(`🚨 Invalid origin: ${origin} from ${clientIP}`);
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // Authentication check for protected routes only
  const protectedRoutes = ['/api/admin', '/api/user', '/api/settings', '/api/billing', '/api/protected'];
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  // Additional security checks for all routes
  if (userAgent.includes('sqlmap') || userAgent.includes('bot-crawler')) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  // Check for suspicious patterns in URL
  const url = request.nextUrl.pathname;
  if (url.includes('sqlmap') || url.includes('malicious')) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  // For valid requests, return undefined to allow the request to continue
  return undefined;
}

// Configure which paths should be processed by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 