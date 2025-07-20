// ===== LOADING STATES MANAGER =====

class LoadingStatesManager {
  constructor() {
    this.init();
  }

  init() {
    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupImageLoading();
        this.setupFormLoading();
        this.setupSkeletonLoading();
      });
    } else {
      this.setupImageLoading();
      this.setupFormLoading();
      this.setupSkeletonLoading();
    }
  }

  // ===== IMAGE LOADING WITH SKELETON PLACEHOLDER =====
  setupImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
      // Skip if already loaded or has skeleton wrapper
      if (img.complete || img.parentElement.classList.contains('image-loading-wrapper')) return;
      
      this.wrapImageWithSkeleton(img);
    });
  }

  wrapImageWithSkeleton(img) {
    // Create skeleton wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'image-loading-wrapper';
    wrapper.style.cssText = `
      position: relative;
      display: inline-block;
      width: ${img.getAttribute('width') || 'auto'};
      height: ${img.getAttribute('height') || 'auto'};
    `;

    // Create skeleton placeholder
    const skeleton = document.createElement('div');
    skeleton.className = 'image-skeleton';
    skeleton.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    `;

    // Add fade-in class to image
    img.classList.add('fade-in');

    // Wrap image with skeleton
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(skeleton);

    // Handle image load
    const handleImageLoad = () => {
      img.classList.add('loaded');
      skeleton.style.opacity = '0';
      setTimeout(() => {
        if (skeleton.parentNode) {
          skeleton.remove();
        }
      }, 300);
    };

    // Handle image error
    const handleImageError = () => {
      skeleton.innerHTML = '<div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">Failed to load</div>';
    };

    if (img.complete) {
      handleImageLoad();
    } else {
      img.addEventListener('load', handleImageLoad);
      img.addEventListener('error', handleImageError);
    }
  }

  // ===== FORM LOADING INDICATORS =====
  setupFormLoading() {
    const forms = document.querySelectorAll('form');
    const buttons = document.querySelectorAll('button[type="submit"], .primary-button, .footer-button, .nav-button');

    // Add click handlers to buttons
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Skip if it's a regular navigation link
        if (button.tagName === 'A' && !button.closest('form')) {
          return;
        }
        
        this.showButtonLoading(button);
        
        // Remove loading state after 3 seconds (for demo purposes)
        setTimeout(() => {
          this.hideButtonLoading(button);
        }, 3000);
      });
    });

    // Add form submission handlers
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
          this.showButtonLoading(submitBtn);
        }
      });
    });
  }

  showButtonLoading(button) {
    // Store original content
    if (!button.dataset.originalContent) {
      button.dataset.originalContent = button.innerHTML;
    }
    
    // Add loading state
    button.classList.add('btn-loading');
    button.disabled = true;
    
    // Add spinner for text buttons
    if (button.tagName === 'BUTTON' || button.classList.contains('text-button')) {
      button.innerHTML = '<span class="loading-spinner"></span>Loading...';
    }
  }

  hideButtonLoading(button) {
    // Remove loading state
    button.classList.remove('btn-loading');
    button.disabled = false;
    
    // Restore original content
    if (button.dataset.originalContent) {
      button.innerHTML = button.dataset.originalContent;
    }
  }

  // ===== SKELETON LOADING FOR DYNAMIC CONTENT =====
  setupSkeletonLoading() {
    // Create skeleton placeholders for any elements marked for loading
    const skeletonElements = document.querySelectorAll('[data-skeleton]');
    
    skeletonElements.forEach(element => {
      this.createSkeletonFor(element);
    });
  }

  createSkeletonFor(element) {
    const skeletonType = element.dataset.skeleton;
    const skeleton = document.createElement('div');
    
    switch (skeletonType) {
      case 'text':
        skeleton.className = 'text-skeleton';
        break;
      case 'text-short':
        skeleton.className = 'text-skeleton short';
        break;
      case 'text-medium':
        skeleton.className = 'text-skeleton medium';
        break;
      case 'image':
        skeleton.className = 'image-skeleton';
        skeleton.style.height = element.offsetHeight + 'px';
        break;
      default:
        skeleton.className = 'skeleton';
    }
    
    // Hide original element and show skeleton
    element.style.display = 'none';
    element.parentNode.insertBefore(skeleton, element);
    
    // Store reference for later removal
    element.dataset.skeletonElement = 'true';
    skeleton.dataset.originalElement = element;
  }

  // ===== UTILITY METHODS =====
  
  // Method to remove skeleton and show content
  showContent(element) {
    if (element.dataset.skeletonElement) {
      const skeletons = element.parentNode.querySelectorAll('.skeleton, .text-skeleton, .image-skeleton');
      skeletons.forEach(skeleton => {
        if (skeleton.dataset.originalElement === element) {
          skeleton.remove();
        }
      });
      element.style.display = '';
      element.classList.add('fade-in', 'loaded');
    }
  }

  // Method to add loading overlay to any element
  addLoadingOverlay(element, isDark = false) {
    const overlay = document.createElement('div');
    overlay.className = `loading-overlay ${isDark ? 'dark' : ''}`;
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    
    // Make parent relative if not already
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.position === 'static') {
      element.style.position = 'relative';
    }
    
    element.appendChild(overlay);
    return overlay;
  }

  // Method to remove loading overlay
  removeLoadingOverlay(element) {
    const overlay = element.querySelector('.loading-overlay');
    if (overlay) {
      overlay.remove();
    }
  }
}

// ===== ENHANCED IMAGE LAZY LOADING =====
class EnhancedLazyLoading {
  constructor() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
        rootMargin: '50px 0px',
        threshold: 0.1
      });
      this.init();
    }
  }

  init() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.classList.add('blur-up');
      this.observer.observe(img);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Create a new image to preload
        const tempImg = new Image();
        tempImg.onload = () => {
          img.src = tempImg.src;
          img.classList.add('loaded');
          this.observer.unobserve(img);
        };
        
        // Start loading the image
        tempImg.src = img.getAttribute('data-src') || img.src;
      }
    });
  }
}

// ===== AUTO-INITIALIZE =====
// Initialize when script loads
new LoadingStatesManager();
new EnhancedLazyLoading();

// Export for manual use
window.LoadingStatesManager = LoadingStatesManager; 