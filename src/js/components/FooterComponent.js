/**
 * @fileoverview Footer Component
 * Handles the main footer section
 */

export default class FooterComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.app = options.app;
    this.logger = options.logger;
  }

  async init() {
    try {
      // Load footer HTML content
      const response = await fetch('/src/components/Layout/Footer.html');
      if (response.ok) {
        const html = await response.text();
        this.element.innerHTML = html;
        this.setupEventListeners();
        this.logger?.info('Footer component initialized');
      } else {
        // Fallback footer
        this.createFallbackFooter();
      }
    } catch (error) {
      this.logger?.error('Footer component initialization failed', error);
      this.createFallbackFooter();
    }
  }

  createFallbackFooter() {
    this.element.innerHTML = `
      <footer class="footer" role="contentinfo">
        <div class="container">
          <div class="footer__content">
            <div class="footer__section">
              <div class="footer__logo">
                <img src="/assets/RescuePC_Logo_Light.png" alt="RescuePC Repairs" width="150" height="40">
              </div>
              <p class="footer__description">
                Professional Windows repair solutions trusted by users worldwide. 
                Fix, optimize, and secure your PC with our comprehensive toolkit.
              </p>
            </div>
            
            <div class="footer__section">
              <h3 class="footer__title">Quick Links</h3>
              <ul class="footer__links">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="/support.html">Support</a></li>
                <li><a href="/Knowledge-Base.html">Knowledge Base</a></li>
              </ul>
            </div>
            
            <div class="footer__section">
              <h3 class="footer__title">Legal</h3>
              <ul class="footer__links">
                <li><a href="/PrivacyPolicy.html">Privacy Policy</a></li>
                <li><a href="/TermOfService.html">Terms of Service</a></li>
                <li><a href="/RefundPolicy.html">Refund Policy</a></li>
                <li><a href="/License.html">License</a></li>
              </ul>
            </div>
            
            <div class="footer__section">
              <h3 class="footer__title">Connect</h3>
              <div class="footer__social">
                <a href="https://www.tiktok.com/@rescuepcrepairs" target="_blank" rel="noopener" aria-label="TikTok">

                </a>
                <a href="https://www.youtube.com/@RescuePC-Repairs" target="_blank" rel="noopener" aria-label="YouTube">

                </a>
                <a href="https://x.com/RescuePCRepair" target="_blank" rel="noopener" aria-label="Twitter">

                </a>
              </div>
            </div>
          </div>
          
          <div class="footer__bottom">
            <p>&copy; ${new Date().getFullYear()} RescuePC Repairs. All rights reserved.</p>
            <p>Professional Windows repair solutions available worldwide.</p>
          </div>
        </div>
      </footer>
    `;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Smooth scroll for internal links
    const internalLinks = this.element.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // External link tracking
    const externalLinks = this.element.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.logger?.info('External link clicked', { url: link.href });
      });
    });
  }

  destroy() {
    // Cleanup if needed
  }
} 
