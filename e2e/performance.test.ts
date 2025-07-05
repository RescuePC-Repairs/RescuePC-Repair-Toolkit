import { test, expect, Browser, Page, BrowserContext } from '@playwright/test';
import { playAudit, PlaywrightLighthouse } from 'playwright-lighthouse';
import type { CDPSession } from 'playwright-core';

// Performance thresholds
const PERFORMANCE_THRESHOLD = 90;
const ACCESSIBILITY_THRESHOLD = 95;
const BEST_PRACTICES_THRESHOLD = 95;
const SEO_THRESHOLD = 95;
const PWA_THRESHOLD = 90;

// Time thresholds (in milliseconds)
const TTFB_THRESHOLD = 200;
const FCP_THRESHOLD = 1500;
const LCP_THRESHOLD = 2500;
const CLS_THRESHOLD = 0.1;
const FID_THRESHOLD = 100;

// Extend Window interface to include our performance metrics
declare global {
  interface Window {
    performanceMetrics: {
      lcp: number;
      fid: number;
      cls: number;
      fcp: number;
      ttfb: number;
    };
  }
}

// Extend PerformanceEntry for specific entry types
interface LargestContentfulPaintEntry extends PerformanceEntry {
  startTime: number;
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
  startTime: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

interface NavigationEntry extends PerformanceEntry {
  responseStart: number;
  requestStart: number;
}

interface ImageAttributes {
  hasWidth: boolean;
  hasHeight: boolean;
  loading: string | null;
  src: string | null;
}

interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Clear cache and cookies before each test
    await page.context().clearCookies();
    const session = await page.context().newCDPSession(page);
    await session.send('Network.clearBrowserCache');
  });

  test('should meet core web vitals thresholds', async ({ page }: { page: Page }) => {
    // Enable performance metrics
    const client = await page.context().newCDPSession(page);
    await client.send('Performance.enable');

    // Navigate to home page
    const navigationStart = Date.now();
    await page.goto('https://rescuepcrepairs.com');
    const ttfb = Date.now() - navigationStart;

    // Get performance metrics
    const metrics = await getPerformanceMetrics(page);

    // Assert performance metrics
    expect(ttfb).toBeLessThan(TTFB_THRESHOLD);
    expect(metrics.firstContentfulPaint).toBeLessThan(FCP_THRESHOLD);
    expect(metrics.largestContentfulPaint).toBeLessThan(LCP_THRESHOLD);
    expect(metrics.cumulativeLayoutShift).toBeLessThan(CLS_THRESHOLD);
    expect(metrics.firstInputDelay).toBeLessThan(FID_THRESHOLD);
  });

  test('should pass Lighthouse audit', async ({ browser }: { browser: Browser }) => {
    const page = await browser.newPage();
    const lighthouseReport = await playAudit({
      page,
      url: 'https://rescuepcrepairs.com',
      thresholds: {
        performance: PERFORMANCE_THRESHOLD,
        accessibility: ACCESSIBILITY_THRESHOLD,
        'best-practices': BEST_PRACTICES_THRESHOLD,
        seo: SEO_THRESHOLD,
        pwa: PWA_THRESHOLD
      },
      port: 9222
    });

    expect(lighthouseReport.scores.performance).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLD);
    expect(lighthouseReport.scores.accessibility).toBeGreaterThanOrEqual(ACCESSIBILITY_THRESHOLD);
    expect(lighthouseReport.scores['best-practices']).toBeGreaterThanOrEqual(
      BEST_PRACTICES_THRESHOLD
    );
    expect(lighthouseReport.scores.seo).toBeGreaterThanOrEqual(SEO_THRESHOLD);
    expect(lighthouseReport.scores.pwa).toBeGreaterThanOrEqual(PWA_THRESHOLD);
  });

  test('should optimize image loading', async ({ page }: { page: Page }) => {
    await page.goto('https://rescuepcrepairs.com');

    // Check if images have width and height attributes
    const images = await page.$$eval('img', (imgs: HTMLImageElement[]): ImageAttributes[] => {
      return imgs.map((img) => ({
        hasWidth: img.hasAttribute('width'),
        hasHeight: img.hasAttribute('height'),
        loading: img.getAttribute('loading'),
        src: img.getAttribute('src')
      }));
    });

    for (const img of images) {
      expect(img.hasWidth).toBe(true);
      expect(img.hasHeight).toBe(true);
      if (!img.src?.startsWith('data:')) {
        expect(img.loading).toBe('lazy');
      }
    }
  });

  test('should have efficient resource loading', async ({ page }: { page: Page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');

    // Track resource sizes
    const resourceSizes: { [key: string]: number } = {};
    client.on('Network.responseReceived', async (event: any) => {
      const response = await client
        .send('Network.getResponseBody', {
          requestId: event.requestId
        })
        .catch(() => null);

      if (response) {
        resourceSizes[event.response.url] = response.body.length;
      }
    });

    await page.goto('https://rescuepcrepairs.com');

    // Check resource sizes
    const totalJSSize = Object.entries(resourceSizes)
      .filter(([url]) => url.endsWith('.js'))
      .reduce((sum, [, size]) => sum + size, 0);

    const totalCSSSize = Object.entries(resourceSizes)
      .filter(([url]) => url.endsWith('.css'))
      .reduce((sum, [, size]) => sum + size, 0);

    // Maximum sizes in bytes
    expect(totalJSSize).toBeLessThan(500 * 1024); // 500KB
    expect(totalCSSSize).toBeLessThan(100 * 1024); // 100KB
  });

  test('should have efficient caching', async ({ page }: { page: Page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');

    // Track cache headers
    const cacheHeaders: { [key: string]: string } = {};
    client.on('Network.responseReceived', (event: any) => {
      const headers = event.response.headers;
      cacheHeaders[event.response.url] = headers['cache-control'] || '';
    });

    await page.goto('https://rescuepcrepairs.com');

    // Check cache headers for static assets
    const staticAssets = Object.entries(cacheHeaders).filter(([url]) =>
      /\.(js|css|png|jpg|jpeg|gif|svg)$/.test(url)
    );

    for (const [url, cacheControl] of staticAssets) {
      expect(cacheControl).toMatch(/max-age=\d+/);
      if (url.includes('/static/')) {
        expect(cacheControl).toContain('immutable');
      }
    }
  });
});

async function getPerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
  const metrics = await page.evaluate(() => ({
    firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
    largestContentfulPaint:
      performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0,
    cumulativeLayoutShift: performance
      .getEntriesByName('layout-shift')
      .reduce((sum, entry) => sum + entry.value, 0),
    firstInputDelay: performance.getEntriesByName('first-input-delay')[0]?.duration || 0
  }));

  return metrics;
}
