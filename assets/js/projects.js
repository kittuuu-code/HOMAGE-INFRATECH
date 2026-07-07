/* ==========================================================================
   HOMAGE INFRATECH - PROJECTS PAGE BEHAVIOR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProjectDropdowns();
  initProjectModals();
  initProjectSearch();
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
  const shareText = `Check out this premium plotted development opportunity "${projectName.toUpperCase()}" by Homage Infratech (Est. 2005). Clear title deeds and secure investment. Details: `;
  const shareUrl = encodeURIComponent(window.location.href);
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}${shareUrl}`;
  window.open(waUrl, '_blank');
}
window.shareProject = shareProject;

/**
 * Dynamic Project Search Filtering
 */
function initProjectSearch() {
  const searchInput = document.getElementById('project-search-input');
  if (!searchInput) return;

  const projectCards = document.querySelectorAll('.projects-grid .project-card');
  const gridContainer = document.querySelector('.projects-grid');

  // Create a No Results message element
  const noResultsMsg = document.createElement('div');
  noResultsMsg.className = 'no-results-msg hidden';
  noResultsMsg.innerHTML = `
    <svg style="width: 48px; height: 48px; margin: 0 auto 15px auto; display: block; fill: var(--text-white-muted);" viewBox="0 0 24 24">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
    <h4>No Projects Found</h4>
    <p>We couldn't find any projects matching "<strong><span id="search-term-display"></span></strong>". Try searching for another location or type.</p>
  `;
  gridContainer.appendChild(noResultsMsg);

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    projectCards.forEach(card => {
      // Extract details
      const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
      const loc = card.querySelector('.project-card-loc') ? card.querySelector('.project-card-loc').textContent.toLowerCase() : '';
      const desc = card.querySelector('.project-card-desc') ? card.querySelector('.project-card-desc').textContent.toLowerCase() : '';
      const badge = card.querySelector('.project-type-badge') ? card.querySelector('.project-type-badge').textContent.toLowerCase() : '';

      if (title.includes(query) || loc.includes(query) || desc.includes(query) || badge.includes(query)) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (visibleCount === 0) {
      const termDisplay = document.getElementById('search-term-display');
      if (termDisplay) termDisplay.textContent = searchInput.value;
      noResultsMsg.classList.remove('hidden');
    } else {
      noResultsMsg.classList.add('hidden');
    }
  });
}
