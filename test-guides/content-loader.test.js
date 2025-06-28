/**
 * RescuePC Repairs - Content Loader Tests
 * =======================================
 * Comprehensive test suite for content loading and caching
 */

import { ContentLoader } from '../src/utils/content-loader.js';

// Mock fetch globally
global.fetch = jest.fn();

describe('ContentLoader', () => {
  let contentLoader;
  let mockResponse;
  let validContent;

  beforeEach(() => {
    contentLoader = new ContentLoader();
    
    // Reset fetch mock
    fetch.mockClear();
    
    // Valid content structure for testing
    validContent = {
      site: {
        name: "RescuePC Repairs",
        tagline: "Professional Windows Repair Toolkit",
        price: "$79.99"
      },
      hero: {
        title: "Test Hero",
        subtitle: "Test Subtitle"
      },
      features: {
        title: "Test Features",
        items: [
          { icon: "🛠️", title: "Test Feature", description: "Test Description" }
        ]
      },
      pricing: {
        title: "Test Pricing",
        price: "$79.99"
      },
      navigation: {
        brand: "RescuePC",
        links: []
      },
      testimonials: [
        { rating: 5, text: "Great!", author: "Test User" }
      ],
      faq: [
        { question: "Test?", answer: "Yes!" }
      ]
    };

    // Mock successful response
    mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue(validContent)
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    test('should initialize with empty cache and loading promises', () => {
      expect(contentLoader.cache).toBeInstanceOf(Map);
      expect(contentLoader.loadingPromises).toBeInstanceOf(Map);
      expect(contentLoader.cache.size).toBe(0);
      expect(contentLoader.loadingPromises.size).toBe(0);
    });
  });

  describe('loadContent', () => {
    test('should fetch and cache content successfully', async () => {
      fetch.mockResolvedValue(mockResponse);

      const result = await contentLoader.loadContent('/test/path.json');

      expect(fetch).toHaveBeenCalledWith('/test/path.json');
      expect(result).toEqual(validContent);
      expect(contentLoader.cache.has('/test/path.json')).toBe(true);
      expect(contentLoader.cache.get('/test/path.json')).toEqual(validContent);
    });

    test('should return cached content on subsequent calls', async () => {
      fetch.mockResolvedValue(mockResponse);

      // First call
      await contentLoader.loadContent('/test/path.json');
      
      // Second call should use cache
      const result = await contentLoader.loadContent('/test/path.json');

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(validContent);
    });

    test('should use default path when none provided', async () => {
      fetch.mockResolvedValue(mockResponse);

      await contentLoader.loadContent();

      expect(fetch).toHaveBeenCalledWith('/src/data/content.json');
    });

    test('should handle concurrent requests for same path', async () => {
      fetch.mockResolvedValue(mockResponse);

      // Start multiple concurrent requests
      const promises = [
        contentLoader.loadContent('/test/path.json'),
        contentLoader.loadContent('/test/path.json'),
        contentLoader.loadContent('/test/path.json')
      ];

      const results = await Promise.all(promises);

      // Should only fetch once
      expect(fetch).toHaveBeenCalledTimes(1);
      
      // All results should be identical
      results.forEach(result => {
        expect(result).toEqual(validContent);
      });
    });

    test('should return fallback content on fetch failure', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      const result = await contentLoader.loadContent('/test/path.json');

      expect(result).toHaveProperty('site');
      expect(result).toHaveProperty('hero');
      expect(result).toHaveProperty('features');
      expect(result.site.name).toBe('RescuePC Repairs');
    });
  });

  describe('validateContent', () => {
    test('should validate content structure without errors', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      contentLoader.validateContent(validContent);

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should warn about missing required sections', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const incompleteContent = { site: { name: "Test" } };

      contentLoader.validateContent(incompleteContent);

      expect(consoleSpy).toHaveBeenCalledWith('Missing content section: hero');
      expect(consoleSpy).toHaveBeenCalledWith('Missing content section: features');
      expect(consoleSpy).toHaveBeenCalledWith('Missing content section: pricing');
      expect(consoleSpy).toHaveBeenCalledWith('Missing content section: navigation');
      
      consoleSpy.mockRestore();
    });
  });

  describe('clearCache', () => {
    test('should clear all cached content', async () => {
      fetch.mockResolvedValue(mockResponse);

      // Load some content to cache
      await contentLoader.loadContent('/test/path1.json');
      await contentLoader.loadContent('/test/path2.json');

      expect(contentLoader.cache.size).toBe(2);

      // Clear cache
      contentLoader.clearCache();

      expect(contentLoader.cache.size).toBe(0);
    });
  });

  describe('preload', () => {
    test('should preload multiple content files', async () => {
      fetch.mockResolvedValue(mockResponse);

      const paths = ['/test/path1.json', '/test/path2.json', '/test/path3.json'];
      await contentLoader.preload(paths);

      expect(fetch).toHaveBeenCalledTimes(3);
      expect(contentLoader.cache.size).toBe(3);
      
      paths.forEach(path => {
        expect(contentLoader.cache.has(path)).toBe(true);
      });
    });

    test('should preload default path when no paths provided', async () => {
      fetch.mockResolvedValue(mockResponse);

      await contentLoader.preload();

      expect(fetch).toHaveBeenCalledWith('/src/data/content.json');
      expect(contentLoader.cache.has('/src/data/content.json')).toBe(true);
    });
  });

  describe('getCached', () => {
    test('should return cached content if available', async () => {
      fetch.mockResolvedValue(mockResponse);

      // Load content first
      await contentLoader.loadContent('/test/path.json');

      // Get cached content
      const cached = contentLoader.getCached('/test/path.json');

      expect(cached).toEqual(validContent);
    });

    test('should return null if content not cached', () => {
      const cached = contentLoader.getCached('/test/path.json');
      expect(cached).toBeNull();
    });
  });

  describe('isCached', () => {
    test('should return true for cached content', async () => {
      fetch.mockResolvedValue(mockResponse);

      await contentLoader.loadContent('/test/path.json');

      expect(contentLoader.isCached('/test/path.json')).toBe(true);
    });

    test('should return false for non-cached content', () => {
      expect(contentLoader.isCached('/test/path.json')).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should handle network timeouts gracefully', async () => {
      fetch.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      const result = await contentLoader.loadContent('/test/path.json');

      expect(result).toHaveProperty('site');
      expect(result.site.name).toBe('RescuePC Repairs');
    });
  });

  describe('Performance', () => {
    test('should handle multiple concurrent different requests efficiently', async () => {
      fetch.mockResolvedValue(mockResponse);

      const paths = Array.from({ length: 10 }, (_, i) => `/test/path${i}.json`);
      const startTime = Date.now();

      await Promise.all(paths.map(path => contentLoader.loadContent(path)));

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete reasonably quickly (less than 1 second)
      expect(duration).toBeLessThan(1000);
      expect(fetch).toHaveBeenCalledTimes(10);
      expect(contentLoader.cache.size).toBe(10);
    });
  });
});

describe('Exported Functions', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('loadContent function should work', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue({ test: 'data' })
    };
    fetch.mockResolvedValue(mockResponse);

    // Import the function
    const { loadContent } = await import('../src/utils/content-loader.js');
    
    const result = await loadContent('/test/path.json');
    
    expect(result).toEqual({ test: 'data' });
  });

  test('clearContentCache function should work', async () => {
    const { clearContentCache, loadContent, isContentCached } = await import('../src/utils/content-loader.js');
    
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue({ test: 'data' })
    };
    fetch.mockResolvedValue(mockResponse);

    // Load content first
    await loadContent('/test/path.json');
    expect(isContentCached('/test/path.json')).toBe(true);

    // Clear cache
    clearContentCache();
    expect(isContentCached('/test/path.json')).toBe(false);
  });
});
