/**
 * Email Capture System - Lead Generation
 * Handles email capture forms, floating bar, and lead tracking
 * Built for enterprise-grade reliability and maximum conversions
 */

class EmailCaptureSystem {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initFloatingBar();
    this.trackScrollBehavior();
  }

  setupEventListeners() {
    // Main email capture form
    const emailForm = document.getElementById('email-capture-form');
    if (emailForm) {
      emailForm.addEventListener('submit', (e) => this.handleEmailSubmit(e));
    }

    // Floating email bar
    const floatingSubmit = document.getElementById('floating-submit');
    const floatingClose = document.getElementById('floating-close');
    const floatingEmail = document.getElementById('floating-email');

    if (floatingSubmit) {
      floatingSubmit.addEventListener('click', () => this.handleFloatingSubmit());
    }

    if (floatingClose) {
      floatingClose.addEventListener('click', () => this.hideFloatingBar());
    }

    if (floatingEmail) {
      floatingEmail.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleFloatingSubmit();
        }
      });
    }
  }

  initFloatingBar() {
    const floatingBar = document.getElementById('floating-email-bar');
    if (!floatingBar) return;

    // Show floating bar after 30 seconds or when user scrolls 70% down
    setTimeout(() => {
      if (!this.hasUserInteracted()) {
        this.showFloatingBar();
      }
    }, 30000);

    // Track scroll position for floating bar trigger
    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
      if (scrollTriggered) return;
      
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 70 && !this.hasUserInteracted()) {
        this.showFloatingBar();
        scrollTriggered = true;
      }
    });
  }

  showFloatingBar() {
    const floatingBar = document.getElementById('floating-email-bar');
    if (floatingBar && !floatingBar.classList.contains('show')) {
      floatingBar.classList.add('show');
      this.trackEvent('floating_bar_shown');
    }
  }

  hideFloatingBar() {
    const floatingBar = document.getElementById('floating-email-bar');
    if (floatingBar) {
      floatingBar.classList.remove('show');
      this.trackEvent('floating_bar_closed');
      // Hide for 24 hours
      localStorage.setItem('floating_bar_hidden', Date.now().toString());
    }
  }

  hasUserInteracted() {
    const hiddenTime = localStorage.getItem('floating_bar_hidden');
    if (hiddenTime) {
      const timeDiff = Date.now() - parseInt(hiddenTime);
      // Show again after 24 hours
      return timeDiff < 24 * 60 * 60 * 1000;
    }
    return false;
  }

  async handleEmailSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const nameInput = form.querySelector('#email-name');
    const emailInput = form.querySelector('#email-address');
    
    const name = nameInput?.value?.trim();
    const email = emailInput?.value?.trim();

    if (!this.validateEmail(email)) {
      this.showError('Please enter a valid email address');
      return;
    }

    if (!name) {
      this.showError('Please enter your name');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.email-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      // Simulate API call (replace with your actual email service)
      await this.submitEmailToService(name, email);
      
      // Show success message
      this.showSuccessMessage();
      
      // Track conversion
      this.trackEvent('email_captured', { name, email });
      
      // Send to purchase funnel
      this.redirectToPurchase();
      
    } catch (error) {
      console.error('Email submission error:', error);
      this.showError('Something went wrong. Please try again.');
    } finally {
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  async handleFloatingSubmit() {
    const emailInput = document.getElementById('floating-email');
    const email = emailInput?.value?.trim();

    if (!this.validateEmail(email)) {
      this.showError('Please enter a valid email address');
      return;
    }

    // Show loading state
    const submitBtn = document.getElementById('floating-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    try {
      await this.submitEmailToService('Floating Bar User', email);
      
      // Track conversion
      this.trackEvent('floating_email_captured', { email });
      
      // Hide floating bar and redirect
      this.hideFloatingBar();
      this.redirectToPurchase();
      
    } catch (error) {
      console.error('Floating email submission error:', error);
      this.showError('Something went wrong. Please try again.');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  async submitEmailToService(name, email) {
    // Replace this with your actual email service integration
    // Examples: Mailchimp, ConvertKit, ActiveCampaign, etc.
    
    // For now, we'll simulate a successful submission
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store in localStorage for demo purposes
        const leads = JSON.parse(localStorage.getItem('email_leads') || '[]');
        leads.push({
          name,
          email,
          timestamp: new Date().toISOString(),
          source: 'rescuepc_repairs'
        });
        localStorage.setItem('email_leads', JSON.stringify(leads));
        
        resolve();
      }, 1000);
    });
  }

  showSuccessMessage() {
    const form = document.getElementById('email-capture-form');
    const success = document.getElementById('email-success');
    
    if (form && success) {
      form.style.display = 'none';
      success.style.display = 'block';
    }
  }

  showError(message) {
    // Create or update error message
    let errorDiv = document.querySelector('.email-error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'email-error';
      errorDiv.style.cssText = `
        color: #dc2626;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        padding: 12px;
        margin: 8px 0;
        font-size: 14px;
        text-align: center;
      `;
      
      const form = document.getElementById('email-capture-form');
      if (form) {
        form.insertBefore(errorDiv, form.firstChild);
      }
    }
    
    errorDiv.textContent = message;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  redirectToPurchase() {
    // Redirect to purchase page with email tracking
    const email = document.getElementById('email-address')?.value || 
                  document.getElementById('floating-email')?.value;
    
    if (email) {
      const purchaseUrl = `https://buy.stripe.com/9B614m53s8i97y110j08g00?prefilled_email=${encodeURIComponent(email)}`;
      window.location.href = purchaseUrl;
    } else {
      window.location.href = 'https://buy.stripe.com/9B614m53s8i97y110j08g00';
    }
  }

  trackScrollBehavior() {
    let scrollEvents = [];
    
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      
      // Track scroll milestones
      [25, 50, 75, 90].forEach(milestone => {
        if (scrollPercent >= milestone && !scrollEvents.includes(milestone)) {
          scrollEvents.push(milestone);
          this.trackEvent('scroll_milestone', { percent: milestone });
        }
      });
    });
  }

  trackEvent(eventName, data = {}) {
    // Track events for analytics
    const eventData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...data
    };

    // Store events in localStorage for demo
    const events = JSON.parse(localStorage.getItem('email_events') || '[]');
    events.push(eventData);
    localStorage.setItem('email_events', JSON.stringify(events));

    // Log for debugging
    console.log('📧 Email Capture Event:', eventData);

    // Send to analytics service (replace with your preferred service)
    // Example: Google Analytics, Mixpanel, etc.
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }
  }
}

// Initialize email capture system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new EmailCaptureSystem();
});

// Export for potential external use
window.EmailCaptureSystem = EmailCaptureSystem; 