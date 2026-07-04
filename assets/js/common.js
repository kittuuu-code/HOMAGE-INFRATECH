/* ==========================================================================
   HOMAGE INFRATECH - GLOBAL JAVASCRIPT
   Est. 2005 | Faridabad, Haryana
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStickyHeader();
  initActiveLink();
  initContactQueryPrefill();
  initScrollAnimations();
  initOnloadPopup();
});

/**
 * Mobile Navbar Toggle and Dropdown / Submenu Handlers
 */
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Prevent scrolling when mobile menu is open
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        // Close all mobile dropdowns when mobile menu closes
        document.querySelectorAll('.nav-dropdown-wrap.active, .nav-submenu-wrap.active').forEach(wrap => {
          wrap.classList.remove('active');
        });
      }
    });

    // Close menu when clicking a normal nav link (excluding dropdown triggers)
    const normalLinks = document.querySelectorAll('.nav-menu a:not(.nav-link-dropdown):not(.nav-submenu-title)');
    normalLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        // Close all mobile dropdowns
        document.querySelectorAll('.nav-dropdown-wrap.active, .nav-submenu-wrap.active').forEach(wrap => {
          wrap.classList.remove('active');
        });
      });
    });

    // Mobile click/tap toggle for Dropdown menus and Submenus
    const dropdownToggles = document.querySelectorAll('.nav-dropdown-wrap > .nav-link-dropdown, .nav-submenu-wrap > .nav-submenu-title');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          
          const parent = toggle.parentElement;
          
          // Close sibling menus
          const siblings = parent.parentElement.children;
          for (let sibling of siblings) {
            if (sibling !== parent) {
              sibling.classList.remove('active');
              sibling.querySelectorAll('.nav-submenu-wrap.active').forEach(subWrap => {
                subWrap.classList.remove('active');
              });
            }
          }
          
          // Toggle current parent
          parent.classList.toggle('active');
        }
      });
    });
  }
}

/**
 * Sticky Header Transition
 */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    
    // Initial check
    handleScroll();
    window.addEventListener('scroll', handleScroll);
  }
}

/**
 * Highlight active link in Navbar and Footer
 */
function initActiveLink() {
  const bodyPage = document.body.getAttribute('data-page');
  if (bodyPage) {
    const navLinks = document.querySelectorAll(`.nav-link[data-link="${bodyPage}"]`);
    navLinks.forEach(link => {
      link.classList.add('active');
    });
  }
}

/**
 * Pre-fill contact form fields from URL query parameters (e.g. ?project=matrabhumi)
 */
function initContactQueryPrefill() {
  const messageInput = document.getElementById('contact-message');
  const interestInput = document.getElementById('contact-interest');
  
  if (!messageInput && !interestInput) return; // Not on contact page
  
  const urlParams = new URLSearchParams(window.location.search);
  const project = urlParams.get('project');
  const interest = urlParams.get('interest');
  
  if (project) {
    const formattedProject = project.toUpperCase();
    if (messageInput) {
      messageInput.value = `I am interested in acquiring a plot at the "${formattedProject}" project. Please share pricing, availability, and layout details.`;
    }
    if (interestInput) {
      if (project.toLowerCase() === 'matrabhumi') {
        // Matrabhumi has both commercial & residential plots
        interestInput.value = 'residential';
      }
    }
  }
  
  if (interest && interestInput) {
    interestInput.value = interest;
  }
}

/**
 * Scroll and Counter Animations
 */
function initScrollAnimations() {
  // 1. Counter Stat Numbers (e.g. on About page)
  const stats = document.querySelectorAll('.stat-number');
  
  if (stats.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = 2000 / target; // Target animation time ~2 seconds
      
      const updateCount = () => {
        // Increment step based on target size
        const increment = Math.ceil(target / 100);
        if (count < target) {
          count += increment;
          if (count > target) count = target;
          el.innerText = count + suffix;
          setTimeout(updateCount, Math.max(speed, 15));
        } else {
          el.innerText = target + suffix;
        }
      };
      updateCount();
    };
    
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => statsObserver.observe(stat));
  }
  
  // 2. Generic Reveal-on-Scroll animations
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }
}

/**
 * Show a success notification toast
 */
function showToast(message) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toastHTML = `
    <div class="toast">
      <div class="toast-success-icon">✓</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', toastHTML);
  const toast = document.querySelector('.toast');
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('active');
  }, 100);
  
  // Auto-hide after 4 seconds
  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 4000);
}
window.showToast = showToast; // Make globally accessible

/**
 * Initialize 5-second delayed onload enquiry popup modal
 */
function initOnloadPopup() {
  // If we are on the contact-us page, don't show the popup
  if (window.location.pathname.includes('/contact-us/')) {
    return;
  }
  
  setTimeout(() => {
    // Check if shown in this session
    if (sessionStorage.getItem('onload_popup_shown')) {
      return;
    }
    
    // Check path prefix to resolve logo.png path
    let pathPrefix = '';
    const pathname = window.location.pathname;
    if (pathname.includes('/about-us/') || pathname.includes('/projects/') || pathname.includes('/gallery/')) {
      pathPrefix = '../';
    }
    
    // Construct HTML
    const popupHTML = `
      <div id="onload-popup" class="modal">
        <div class="modal-content" style="max-width: 420px; overflow: hidden; border-radius: var(--border-radius-lg);">
          <button class="modal-close" id="close-onload-popup" aria-label="Close popup">
            <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
          <div class="modal-header" style="text-align: center; border-bottom: none; padding: 35px 30px 10px 30px;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 0 auto 15px auto; width: max-content;">
              <img src="${pathPrefix}assets/images/logo.png" alt="Homage Infratech Logo" style="height: 52px; width: 52px; border-radius: 50%; border: 2px solid var(--accent-color); object-fit: cover;">
              <div style="text-align: left; font-weight: 800; font-size: 1.3rem; letter-spacing: -0.02em; color: var(--primary-dark); display: flex; flex-direction: column; line-height: 1.1;">
                HOMAGE
                <span style="font-size: 0.65rem; font-weight: 600; color: var(--accent-color); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px;">INFRATECH</span>
              </div>
            </div>
            <h3 style="color: var(--primary-dark); font-weight: 700; font-size: 1.4rem;">Exclusive Plot Deals</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 5px;">Enquire today to receive pricing layout brochures.</p>
          </div>
          <div class="modal-body" style="padding: 10px 30px 35px 30px;">
            <form id="onload-popup-form" novalidate>
              <div class="form-group" style="margin-bottom: 20px; position: relative;">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 600; color: var(--primary-dark); display: block; margin-bottom: 5px; text-transform: uppercase;">Name *</label>
                <input type="text" id="popup-name" class="form-control" placeholder="Enter your full name" style="padding: 11px 14px; font-size: 0.9rem;" required>
                <span class="error-message" style="bottom: -18px; font-size: 0.7rem;"></span>
              </div>
              <div class="form-group" style="margin-bottom: 20px; position: relative;">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 600; color: var(--primary-dark); display: block; margin-bottom: 5px; text-transform: uppercase;">Phone No. *</label>
                <input type="tel" id="popup-phone" class="form-control" placeholder="10-digit mobile number" style="padding: 11px 14px; font-size: 0.9rem;" required>
                <span class="error-message" style="bottom: -18px; font-size: 0.7rem;"></span>
              </div>
              <div class="form-group" style="margin-bottom: 20px; position: relative;">
                <label class="form-label" style="font-size: 0.75rem; font-weight: 600; color: var(--primary-dark); display: block; margin-bottom: 5px; text-transform: uppercase;">Email Address *</label>
                <input type="email" id="popup-email" class="form-control" placeholder="name@domain.com" style="padding: 11px 14px; font-size: 0.9rem;" required>
                <span class="error-message" style="bottom: -18px; font-size: 0.7rem;"></span>
              </div>
              <div class="form-submit-wrap" style="margin-top: 25px;">
                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 0.95rem;">Send Inquiry</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    const popup = document.getElementById('onload-popup');
    const closeBtn = document.getElementById('close-onload-popup');
    const form = document.getElementById('onload-popup-form');
    
    if (popup) {
      popup.classList.add('active');
      document.body.style.overflow = 'hidden';
      sessionStorage.setItem('onload_popup_shown', 'true');
    }
    
    // Close functions
    const closePopup = () => {
      popup.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => popup.remove(), 400);
    };
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closePopup);
    }
    
    if (popup) {
      popup.addEventListener('click', (e) => {
        if (e.target === popup) closePopup();
      });
    }
    
    // Form field validators
    const nameInput = document.getElementById('popup-name');
    const phoneInput = document.getElementById('popup-phone');
    const emailInput = document.getElementById('popup-email');
    
    const validateField = (input, validationFn, errorMsg) => {
      const val = input.value;
      const isValid = validationFn(val);
      const errSpan = input.nextElementSibling;
      if (!isValid) {
        input.classList.add('error');
        if (errSpan) errSpan.innerText = errorMsg;
      } else {
        input.classList.remove('error');
        if (errSpan) errSpan.innerText = '';
      }
      return isValid;
    };
    
    if (nameInput) nameInput.addEventListener('input', () => validateField(nameInput, val => val.trim().length > 1, "Name required (min 2 chars)"));
    if (phoneInput) phoneInput.addEventListener('input', () => validateField(phoneInput, val => /^[6-9]\d{9}$/.test(val.replace(/\D/g, '')), "Valid 10-digit number required"));
    if (emailInput) emailInput.addEventListener('input', () => validateField(emailInput, val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Valid email required"));
    
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isNameValid = validateField(nameInput, val => val.trim().length > 1, "Name required (min 2 chars)");
        const isPhoneValid = validateField(phoneInput, val => /^[6-9]\d{9}$/.test(val.replace(/\D/g, '')), "Valid 10-digit number required");
        const isEmailValid = validateField(emailInput, val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Valid email required");
        
        if (isNameValid && isPhoneValid && isEmailValid) {
          const submitBtn = form.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending Inquiry...";
          }
          
          const leadData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.replace(/\D/g, ''),
            interest: 'onload_popup',
            message: 'Inquiry submitted from automatically loaded homepage popup',
            timestamp: new Date().toISOString()
          };
          
          // Log lead to localStorage
          setTimeout(() => {
            let leads = [];
            try {
              leads = JSON.parse(localStorage.getItem('homage_leads') || '[]');
            } catch (err) {
              leads = [];
            }
            leads.push(leadData);
            localStorage.setItem('homage_leads', JSON.stringify(leads));
            
            closePopup();
            showToast("Inquiry submitted! Our advisor will call you shortly.");
          }, 1000);
        }
      });
    }
  }, 5000);
}
