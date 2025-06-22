/**
 * @fileoverview Features Component
 * Handles the features showcase section
 */

export default class FeaturesComponent {
  constructor(element, options = {}) {
    this.element = element;
    this.app = options.app;
    this.logger = options.logger;
  }

  async init() {
    try {
      // Load features HTML content
      const response = await fetch('/src/components/Sections/Features.html');
      if (response.ok) {
        const html = await response.text();
        this.element.innerHTML = html;
        this.setupEventListeners();
        this.logger?.info('Features component initialized');
      } else {
        // Fallback features
        this.createFallbackFeatures();
      }
    } catch (error) {
      this.logger?.error('Features component initialization failed', error);
      this.createFallbackFeatures();
    }
  }

  createFallbackFeatures() {
    const features = [
      {
        icon: 'fas fa-shield-alt',
        title: 'Virus & Malware Removal',
        description: 'Advanced threat detection and removal with real-time protection'
      },
      {
        icon: 'fas fa-tools',
        title: 'System Optimization',
        description: 'Boost performance with registry cleaning and system tuning'
      },
      {
        icon: 'fas fa-hdd',
        title: 'Data Recovery',
        description: 'Recover lost files and repair corrupted data safely'
      },
      {
        icon: 'fas fa-wifi',
        title: 'Network Diagnostics',
        description: 'Fix connectivity issues and optimize network performance'
      },
      {
        icon: 'fas fa-download',
        title: 'Driver Updates',
        description: 'Automatic driver detection and installation'
      },
      {
        icon: 'fas fa-headset',
        title: '24/7 Support',
        description: 'Global technical support available around the clock'
      }
    ];

    this.element.innerHTML = `
      <section class="features" id="features" role="region" aria-labelledby="features-title">
        <div class="container">
          <div class="section-header">
            <h2 id="features-title" class="section-title">Comprehensive PC Repair Solutions</h2>
            <p class="section-subtitle">Everything you need to keep your Windows PC running perfectly</p>
          </div>
          <div class="features__grid">
            ${features.map(feature => `
              <div class="feature card">
                <div class="feature__icon">
                  <i class="${feature.icon}"></i>
                </div>
                <h3 class="feature__title">${feature.title}</h3>
                <p class="feature__description">${feature.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1
    });

    const features = this.element.querySelectorAll('.feature');
    features.forEach((feature, index) => {
      // Stagger animation delays
      feature.style.animationDelay = `${index * 0.1}s`;
      observer.observe(feature);
    });
  }

  destroy() {
    // Cleanup if needed
  }
} 