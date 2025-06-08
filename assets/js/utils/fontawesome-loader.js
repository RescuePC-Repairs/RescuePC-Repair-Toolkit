import config from '../../css/fontawesome/config.js';

class FontAwesomeLoader {
  constructor() {
    this.config = {
      version: '6.5.1',
      cdnUrl: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome',
      localPath: '/assets/css/fontawesome',
      preloadIcons: true,
      criticalIcons: ['fa-solid', 'fa-brands', 'fa-regular']
    };
    
    this.loadAttempts = 0;
    this.maxAttempts = 3;
    this.loaded = false;
  }

  async init() {
    // Add preconnect for CDN
    this.addPreconnect();
    
    // Preload critical CSS
    this.preloadCriticalCSS();
    
    // Load Font Awesome
    await this.loadFontAwesome();
    
    // Initialize icon observer
    this.initIconObserver();
  }

  addPreconnect() {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://cdnjs.cloudflare.com';
    document.head.appendChild(preconnect);
  }

  preloadCriticalCSS() {
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.as = 'style';
    criticalCSS.href = `${this.config.cdnUrl}/${this.config.version}/css/all.min.css`;
    criticalCSS.onload = () => this.applyStylesheet(criticalCSS);
    document.head.appendChild(criticalCSS);
  }

  applyStylesheet(link) {
    link.rel = 'stylesheet';
    this.loaded = true;
  }

  async loadFontAwesome() {
    if (this.loaded) return;

    try {
      const response = await fetch(`${this.config.cdnUrl}/${this.config.version}/css/all.min.css`);
      if (!response.ok) throw new Error('Failed to load Font Awesome');
      
      const css = await response.text();
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
      this.loaded = true;
    } catch (error) {
      console.error('Error loading Font Awesome:', error);
      this.loadLocalFallback();
    }
  }

  loadLocalFallback() {
    if (this.loadAttempts >= this.maxAttempts) {
      console.error('Failed to load Font Awesome after multiple attempts');
      return;
    }

    this.loadAttempts++;
    const localCSS = document.createElement('link');
    localCSS.rel = 'stylesheet';
    localCSS.href = `${this.config.localPath}/fontawesome.css`;
    localCSS.onload = () => this.loaded = true;
    localCSS.onerror = () => this.loadLocalFallback();
    document.head.appendChild(localCSS);
  }

  initIconObserver() {
    // Create a MutationObserver to watch for dynamically added icons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          this.checkForIcons(mutation.addedNodes);
        }
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  checkForIcons(nodes) {
    nodes.forEach((node) => {
      if (node.nodeType === 1) { // Element node
        if (node.classList && 
            (node.classList.contains('fa') || 
             node.classList.contains('fas') || 
             node.classList.contains('fab') || 
             node.classList.contains('far'))) {
          this.ensureIconLoaded(node);
        }
        // Check child nodes
        if (node.children) {
          this.checkForIcons(Array.from(node.children));
        }
      }
    });
  }

  ensureIconLoaded(iconElement) {
    if (!this.loaded) {
      this.loadFontAwesome();
    }
  }
}

// Initialize Font Awesome loader
const faLoader = new FontAwesomeLoader();
faLoader.init(); 