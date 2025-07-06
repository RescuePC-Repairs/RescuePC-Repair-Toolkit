import { NextRequest, NextResponse } from 'next/server';

// Enhanced rate limiting storage with cleanup
const requestCounts = new Map<string, { count: number; resetTime: number; blocked: boolean }>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  requestCounts.forEach((value, key) => {
    if (now > value.resetTime + 300000) {
      // 5 minutes after reset
      requestCounts.delete(key);
    }
  });
}, 300000);

function getRequestCount(clientIP: string): { count: number; blocked: boolean } {
  const now = Date.now();
  const clientData = requestCounts.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientIP, {
      count: 1,
      resetTime: now + 60000, // 1 minute window
      blocked: false
    });
    return { count: 1, blocked: false };
  }

  if (clientData.blocked) {
    return { count: clientData.count, blocked: true };
  }

  clientData.count++;

  // Block IP if too many requests
  if (clientData.count > 100) {
    clientData.blocked = true;
  }

  return { count: clientData.count, blocked: clientData.blocked };
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Handle case where NextResponse.next() returns undefined (test environment)
  if (!response) {
    return NextResponse.next();
  }

  // Enhanced HTTPS Enforcement - Force HTTPS always
  const protocol = request.headers.get('x-forwarded-proto');
  const host = request.headers.get('host');

  if (protocol !== 'https' && host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    try {
      const url = request.nextUrl.clone();
      url.protocol = 'https';
      return NextResponse.redirect(url, 301);
    } catch (error) {
      console.warn('HTTPS redirect failed, continuing with request');
    }
  }

  // Enhanced Rate Limiting with IP Blocking
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const { count, blocked } = getRequestCount(clientIP);

  if (blocked) {
    return new NextResponse('Too Many Requests - IP Blocked', {
      status: 429,
      headers: {
        'Retry-After': '300', // 5 minutes
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + 300000).toISOString()
      }
    });
  }

  if (count > 100) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + 60000).toISOString()
      }
    });
  }

  // Fortune 500 Security Headers
  if (response.headers) {
    // Core Security Headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
    );

    // Advanced Security Headers
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');

    // Enhanced HSTS with preload
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );

    // Comprehensive Content Security Policy
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://js.stripe.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://api.stripe.com https://fonts.googleapis.com https://vercel.live",
        "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        'upgrade-insecure-requests',
        'block-all-mixed-content'
      ].join('; ')
    );

    // Additional Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('X-Download-Options', 'noopen');
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');

    // Performance Headers
    response.headers.set('X-Powered-By', 'RescuePC Repairs');
    response.headers.set('Server', 'RescuePC Repairs');

    // Cache control for different asset types
    if (
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.startsWith('/favicon.ico') ||
      request.nextUrl.pathname.startsWith('/manifest.json') ||
      request.nextUrl.pathname.startsWith('/sw.js')
    ) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (request.nextUrl.pathname.startsWith('/api/')) {
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    } else {
      response.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
    }

    // Rate limit headers
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', Math.max(0, 100 - count).toString());
    response.headers.set('X-RateLimit-Reset', new Date(Date.now() + 60000).toISOString());
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/health (health check endpoint)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - sw.js (service worker)
     * - robots.txt (SEO)
     * - sitemap.xml (SEO)
     */
    '/((?!api/health|_next/static|_next/image|favicon.ico|manifest.json|sw.js|robots.txt|sitemap.xml).*)'
  ]
};
