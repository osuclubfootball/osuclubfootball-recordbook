// Simplified data loader for Ohio State Club Football Record Book
async function loadRecords() {
  try {
    const response = await fetch("data.json");
    const data = await response.json();
    
    // Make data globally available for other scripts
    window.__osuClubFootballData = data;
    
    console.log('Record book data loaded successfully');
  } catch (error) {
    console.error('Failed to load data:', error);
    
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
      <p>Unable to load record book data. Please refresh the page or check your internet connection.</p>
    `;
    document.body.insertBefore(errorDiv, document.body.firstChild);
  }
}

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
  loadRecords();
  addHeaderMinimizeFunctionality();
});