/* ==========================================================================
   HOMAGE INFRATECH - PROJECTS PAGE BEHAVIOR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProjectDropdowns();
  initProjectModals();
});

/**
 * Project Kebab Dropdown menus
 */
function initProjectDropdowns() {
  const triggers = document.querySelectorAll('.project-action-trigger');
  
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = trigger.nextElementSibling;
      
      // Close other dropdowns
      document.querySelectorAll('.project-action-dropdown').forEach(d => {
        if (d !== dropdown) d.classList.remove('active');
      });
      document.querySelectorAll('.project-action-trigger').forEach(t => {
        if (t !== trigger) t.classList.remove('active');
      });
      
      trigger.classList.toggle('active');
      dropdown.classList.toggle('active');
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.project-action-dropdown').forEach(d => {
      d.classList.remove('active');
    });
    document.querySelectorAll('.project-action-trigger').forEach(t => {
      t.classList.remove('active');
    });
  });
}

/**
 * Modal control and simulated operations
 */
function initProjectModals() {
  const modal = document.getElementById('project-detail-modal');
  const openButtons = document.querySelectorAll('.btn-view-details');
  const closeButton = document.querySelector('.modal-close');
  
  // Open modal
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Close modal
  if (closeButton && modal) {
    closeButton.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Handle brochure download simulation
 */
function downloadBrochure(projectName) {
  if (window.showToast) {
    window.showToast(`Downloading ${projectName.toUpperCase()} Brochure PDF...`);
  }
  
  // Create a temporary hidden anchor element to download a mock file
  setTimeout(() => {
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMiAwIFIKL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNCAwIFIKPj4KPj4KL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNSAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVEYxIDEyIFRmIDUwIDcwMCBUZCAoTUFUUkFCSFVNSSBQTF9UUyAtIEhPTUFHRSBJTkZSQVRFQ0gpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDExOCAwMDAwMCBuIAowMDAwMDAwMjI2IDAwMDAwIG4gCjAwMDAwMDAzMTAgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZg0KMzk2DQolJUVPRg==';
    link.download = `${projectName.toLowerCase()}_brochure.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (window.showToast) {
      window.showToast(`Brochure PDF saved successfully.`);
    }
  }, 1200);
}
window.downloadBrochure = downloadBrochure;

/**
 * Handle custom project URL sharing on WhatsApp
 */
function shareProject(projectName) {
  const shareText = `Check out this premium plotted development opportunity "${projectName.toUpperCase()}" in Sector 85, Faridabad by Homage Infratech (Est. 2005). Clear title deeds and secure NCR investment. Details: `;
  const shareUrl = encodeURIComponent(window.location.href);
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}${shareUrl}`;
  window.open(waUrl, '_blank');
}
window.shareProject = shareProject;
