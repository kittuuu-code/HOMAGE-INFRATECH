/* ==========================================================================
   HOMAGE INFRATECH - GALLERY PAGE BEHAVIOR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});

// Global array of current visible items in the gallery
let galleryItemsData = [];
let currentPhotoIndex = 0;

/**
 * Filter gallery items by category tabs
 */
function initGalleryFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      // Update data array for lightbox index tracking
      updateGalleryData();
    });
  });
}

/**
 * Update the list of active (non-hidden) images for lightbox scrolling
 */
function updateGalleryData() {
  const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
  galleryItemsData = Array.from(visibleItems).map(item => {
    const img = item.querySelector('img');
    const title = item.querySelector('h4').innerText;
    const subtitle = item.querySelector('p').innerText;
    return {
      src: img.getAttribute('src') || img.src,
      title: title,
      subtitle: subtitle,
      element: item
    };
  });
}

/**
 * Lightbox viewer logic
 */
function initLightbox() {
  updateGalleryData(); // Initial load

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-title') : null;
  const lightboxSubtitle = lightbox ? lightbox.querySelector('.lightbox-subtitle') : null;
  const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const prevBtn = lightbox ? lightbox.querySelector('.lightbox-nav-prev') : null;
  const nextBtn = lightbox ? lightbox.querySelector('.lightbox-nav-next') : null;

  if (!lightbox) return;

  // Add click listeners to items
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item && !item.classList.contains('hidden')) {
      const img = item.querySelector('img');
      const src = img.getAttribute('src') || img.src;

      // Find index in filtered data array
      currentPhotoIndex = galleryItemsData.findIndex(d => d.src === src);

      openLightbox(src, galleryItemsData[currentPhotoIndex].title, galleryItemsData[currentPhotoIndex].subtitle);
    }
  });

  function openLightbox(src, title, subtitle) {
    if (lightboxImg && lightboxTitle && lightboxSubtitle) {
      lightboxImg.style.opacity = '0';
      lightboxImg.src = src;
      lightboxTitle.innerText = title;
      lightboxSubtitle.innerText = subtitle;

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Smooth fade in
      setTimeout(() => {
        lightboxImg.style.opacity = '1';
      }, 50);
    }
  }

  function navigateLightbox(dir) {
    currentPhotoIndex += dir;

    // Wrap around index boundaries
    if (currentPhotoIndex < 0) {
      currentPhotoIndex = galleryItemsData.length - 1;
    } else if (currentPhotoIndex >= galleryItemsData.length) {
      currentPhotoIndex = 0;
    }

    const nextData = galleryItemsData[currentPhotoIndex];
    if (nextData && lightboxImg && lightboxTitle && lightboxSubtitle) {
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = nextData.src;
        lightboxTitle.innerText = nextData.title;
        lightboxSubtitle.innerText = nextData.subtitle;
        lightboxImg.style.opacity = '1';
      }, 200);
    }
  }

  // Navigation Click listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });
  }

  // Close Lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = ''; // reset src
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrap') || e.target.classList.contains('lightbox-image-wrap')) {
      closeLightbox();
    }
  });

  // Keyboard navigation helpers
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      navigateLightbox(1);
    }
  });
}
