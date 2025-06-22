/**
 * RescuePC Repairs - Content Loader Utility
 * =========================================
 * Centralized content loading and caching system
 */

class ContentLoader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
  }

  /**
   * Load content from JSON file with caching
   * @param {string} path - Path to content file
   * @returns {Promise<Object>} - Content data
   */
  async loadContent(path = '/src/data/content.json') {
    // Return cached content if available
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path);
    }

    // Create new loading promise
    const loadingPromise = this.fetchContent(path);
    this.loadingPromises.set(path, loadingPromise);

    try {
      const content = await loadingPromise;
      this.cache.set(path, content);
      this.loadingPromises.delete(path);
      return content;
    } catch (error) {
      this.loadingPromises.delete(path);
      throw error;
    }
  }

  /**
   * Fetch content from server
   * @private
   */
  async fetchContent(path) {
    try {
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`Failed to load content: ${response.status} ${response.statusText}`);
      }

      const content = await response.json();
      
      // Validate content structure
      this.validateContent(content);
      
      return content;
    } catch (error) {
      console.error('Content loading error:', error);
      
      // Return fallback content
      return this.getFallbackContent();
    }
  }

  /**
   * Validate content structure
   * @private
   */
  validateContent(content) {
    const requiredSections = ['site', 'hero', 'features', 'pricing', 'navigation'];
    
    for (const section of requiredSections) {
      if (!content[section]) {
        console.warn(`Missing content section: ${section}`);
      }
    }

    // Validate specific structures
    if (content.features && !Array.isArray(content.features.items)) {
      console.warn('Features items should be an array');
    }

    if (content.testimonials && !Array.isArray(content.testimonials)) {
      console.warn('Testimonials should be an array');
    }

    if (content.faq && !Array.isArray(content.faq)) {
      console.warn('FAQ should be an array');
    }
  }

  /**
   * Get fallback content when loading fails
   * @private
   */
  getFallbackContent() {
    return {
      site: {
        name: "RescuePC Repairs",
        tagline: "Professional Windows Repair Toolkit",
        description: "🚀 Instantly repair any Windows PC with our professional-grade toolkit",
        url: "https://rescuepcrepairs.com",
        email: "***REMOVED***",
        price: "$79.99"
      },
      hero: {
        title: "RescuePC Repairs",
        subtitle: "Next-gen repair software you control — powerful, portable, and professional-grade",
        description: "Download once. Run anywhere — your PC or USB. No installations. No subscriptions. No headaches.",
        cta_primary: "🚀 Start in under 60 seconds",
        cta_secondary: "Download & Fix Now"
      },
      features: {
        title: "Powerful Features",
        subtitle: "Designed to make PC repair faster and more efficient",
        items: [
          {
            icon: "🛠️",
            title: "Complete System Repair",
            description: "Fix crashes, errors, and missing drivers with a single click."
          },
          {
            icon: "⚡",
            title: "Zero Configuration",
            description: "Works instantly from any device no installation required."
          },
          {
            icon: "🔒",
            title: "Bank-Grade Security",
            description: "100% secure and virus-free. Scanned by 60+ antivirus solutions."
          }
        ]
      },
      pricing: {
        title: "RescuePC Repairs",
        subtitle: "Lifetime License",
        price: "$79.99",
        description: "One-time payment, lifetime repairs",
        features: [
          "Full Offline Driver Library (11GB)",
          "Network & Wi-Fi Recovery Tools",
          "Windows Error Repair Module",
          "Unlimited PC Repairs",
          "Instant Access & Download"
        ],
        cta: "Buy Now",
        guarantee: "30-Day Money-Back Guarantee"
      },
      navigation: {
        brand: "RescuePC Repairs",
        links: [
          { text: "Home", href: "#home" },
          { text: "Features", href: "#features" },
          { text: "Pricing", href: "#pricing" },
          { text: "FAQ", href: "#faq" },
          { text: "Support", href: "support.html" }
        ],
        cta: "Buy Now"
      },
      testimonials: [
        {
          rating: 5,
          text: "This tool saved me hundreds in repair costs. Fixed my network issues in minutes!",
          author: "Donna K.",
          role: "Small Business Owner",
          initials: "DK"
        }
      ],
      faq: [
        {
          question: "How does RescuePC Repairs work without internet?",
          answer: "RescuePC Repairs includes an offline driver library and all necessary repair tools built-in."
        }
      ],
      about: {
        name: "Tyler",
        title: "Founder of RescuePC Repairs",
        experience: "8+ years",
        description: "Hi, I'm Tyler, the founder and sole developer behind RescuePC Repairs."
      },
      footer: {
        sections: [
          {
            title: "Product",
            links: [
              { text: "Features", href: "#features" },
              { text: "FAQ", href: "#faq" },
              { text: "Support", href: "support.html" }
            ]
          }
        ],
        social: [
          { platform: "TikTok", href: "https://www.tiktok.com/@rescuepcrepairs", icon: "fab fa-tiktok" }
        ],
        copyright: "© 2025 RescuePC Repairs. All rights reserved."
      }
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Preload content
   */
  async preload(paths = ['/src/data/content.json']) {
    const promises = paths.map(path => this.loadContent(path));
    await Promise.allSettled(promises);
  }

  /**
   * Get cached content without loading
   */
  getCached(path = '/src/data/content.json') {
    return this.cache.get(path);
  }

  /**
   * Check if content is cached
   */
  isCached(path = '/src/data/content.json') {
    return this.cache.has(path);
  }
}

// Create singleton instance
const contentLoader = new ContentLoader();

// Export functions for easy use
export const loadContent = (path) => contentLoader.loadContent(path);
export const clearContentCache = () => contentLoader.clearCache();
export const preloadContent = (paths) => contentLoader.preload(paths);
export const getCachedContent = (path) => contentLoader.getCached(path);
export const isContentCached = (path) => contentLoader.isCached(path);

// Export class for advanced usage
export { ContentLoader };

// Auto-preload content when module loads
if (typeof window !== 'undefined') {
  // Preload content after page load
  window.addEventListener('load', () => {
    contentLoader.preload().catch(error => {
      console.warn('Content preloading failed:', error);
    });
  });
} 