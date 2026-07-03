/* ==========================================================================
   HOMAGE INFRATECH - CONTACT US FORM AND LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
});

/**
 * Handle form inputs, validation and simulated submit
 */
function initContactForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;
  
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const interestInput = document.getElementById('contact-interest');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = form.querySelector('.btn-submit');
  
  // Real-time inline validations on input events
  if (nameInput) nameInput.addEventListener('input', () => validateField(nameInput, val => val.trim().length > 1, "Please enter your name (min 2 characters)"));
  if (emailInput) emailInput.addEventListener('input', () => validateField(emailInput, val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Please enter a valid email address"));
  if (phoneInput) phoneInput.addEventListener('input', () => validateField(phoneInput, val => /^[6-9]\d{9}$/.test(val.replace(/\D/g, '')), "Please enter a valid 10-digit Indian phone number"));

  // Form Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Run all validations
    const isNameValid = validateField(nameInput, val => val.trim().length > 1, "Please enter your name (min 2 characters)");
    const isEmailValid = validateField(emailInput, val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Please enter a valid email address");
    const isPhoneValid = validateField(phoneInput, val => /^[6-9]\d{9}$/.test(val.replace(/\D/g, '')), "Please enter a valid 10-digit Indian phone number");
    
    if (isNameValid && isEmailValid && isPhoneValid) {
      submitForm();
    } else {
      // Focus on the first invalid field
      if (!isNameValid && nameInput) nameInput.focus();
      else if (!isEmailValid && emailInput) emailInput.focus();
      else if (!isPhoneValid && phoneInput) phoneInput.focus();
    }
  });
  
  /**
   * Helper validator function
   */
  function validateField(input, validationFn, errorMsg) {
    if (!input) return false;
    const value = input.value;
    const isValid = validationFn(value);
    const errorSpan = input.nextElementSibling;
    
    if (!isValid) {
      input.classList.add('error');
      if (errorSpan && errorSpan.classList.contains('error-message')) {
        errorSpan.innerText = errorMsg;
      }
    } else {
      input.classList.remove('error');
      if (errorSpan && errorSpan.classList.contains('error-message')) {
        errorSpan.innerText = '';
      }
    }
    return isValid;
  }
  
  /**
   * Simulated API Form Submission
   */
  function submitForm() {
    // Disable submit button and show loading status
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Sending Inquiry...";
    }
    
    const leadData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.replace(/\D/g, ''),
      interest: interestInput.value,
      message: messageInput.value.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Simulate server response delay of 1.5 seconds
    setTimeout(() => {
      // Save lead to local storage array for audit/verification
      let leads = [];
      try {
        leads = JSON.parse(localStorage.getItem('homage_leads') || '[]');
      } catch (err) {
        leads = [];
      }
      leads.push(leadData);
      localStorage.setItem('homage_leads', JSON.stringify(leads));
      
      // Re-enable form
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Inquiry Sent! Submit Another";
      }
      
      // Trigger global Success Toast Notification
      if (window.showToast) {
        window.showToast("Inquiry submitted! Our advisor will call you shortly.");
      }
      
      // Clear form
      form.reset();
      
      // Reset button text after 3 seconds
      setTimeout(() => {
        if (submitBtn && submitBtn.innerText === "Inquiry Sent! Submit Another") {
          submitBtn.innerText = "Send Inquiry";
        }
      }, 3000);
      
    }, 1500);
  }
}
