// Header minimize functionality

// Header minimize functionality
function addHeaderMinimizeFunctionality() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  // Create minimize button
  const minimizeBtn = document.createElement('button');
  minimizeBtn.className = 'minimize-btn';
  minimizeBtn.innerHTML = '−';
  minimizeBtn.setAttribute('aria-label', 'Minimize header');
  
  // Add button to header
  header.appendChild(minimizeBtn);

  // Toggle functionality
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

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
  addHeaderMinimizeFunctionality();
});