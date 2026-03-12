// Header minimize functionality
function addHeaderMinimizeFunctionality() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const minimizeBtn = document.createElement('button');
  minimizeBtn.className = 'minimize-btn';
  minimizeBtn.innerHTML = '−';
  minimizeBtn.setAttribute('aria-label', 'Minimize header');
  header.appendChild(minimizeBtn);

  minimizeBtn.addEventListener('click', () => {
    const isMinimized = header.classList.contains('minimized');
    if (isMinimized) {
      header.classList.remove('minimized');
      document.body.classList.remove('header-minimized');
      minimizeBtn.innerHTML = '−';
      minimizeBtn.setAttribute('aria-label', 'Minimize header');
    } else {
      header.classList.add('minimized');
      document.body.classList.add('header-minimized');
      minimizeBtn.innerHTML = '+';
      minimizeBtn.setAttribute('aria-label', 'Expand header');
    }
  });
}

// Mark the current page's nav link as active
function markActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.top-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// Entrance animations via IntersectionObserver
function initEntranceAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = Array.from(entry.target.parentElement?.children || []);
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.min(idx * 60, 300)}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });

  document.querySelectorAll('.card, .photo-card, .result-item').forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addHeaderMinimizeFunctionality();
  markActiveNav();
  initEntranceAnimations();
});
