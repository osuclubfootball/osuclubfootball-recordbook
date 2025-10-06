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

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadRecords);