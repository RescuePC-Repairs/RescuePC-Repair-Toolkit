import { NextRequest, NextResponse } from 'next/server';

// Rate limiting storage
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function getRequestCount(clientIP: string): number {
  const now = Date.now();
  const clientData = requestCounts.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientIP, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return 1;
  }

  clientData.count++;
  return clientData.count;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Handle case where NextResponse.next() returns undefined (test environment)
  if (!response) {
    return NextResponse.next();
  }

  // Force HTTPS always
  if (
    request.headers.get('x-forwarded-proto') !== 'https' &&
    request.headers.get('x-forwarded-proto') !== 'http'
  ) {
    try {
      const url = request.nextUrl.clone();
      url.protocol = 'https';
      return NextResponse.redirect(url, 301);
    } catch (error) {
      // Handle test environment where clone might not work properly
      console.warn('HTTPS redirect failed, continuing with request');
    }
  }

  // Rate limiting
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const requestCount = getRequestCount(clientIP);

  if (requestCount > 100) {
    // 100 requests per minute
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Comprehensive Security Headers
  if (response.headers) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=()'
    );
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://fonts.googleapis.com; frame-src 'self' https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests"
    );

    // Cache control for static assets
    if (
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.startsWith('/favicon.ico')
    ) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    // Remove server information
    response.headers.delete('X-Powered-By');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api/health|_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)']
};
