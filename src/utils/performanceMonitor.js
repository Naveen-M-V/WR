// Performance monitoring utility
export const measurePageLoad = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const connectTime = perfData.responseEnd - perfData.requestStart;
      const renderTime = perfData.domComplete - perfData.domLoading;
      
      console.log('📊 Performance Metrics:');
      console.log(`⏱️ Total Load Time: ${pageLoadTime}ms`);
      console.log(`🔌 Connect Time: ${connectTime}ms`);
      console.log(`🎨 Render Time: ${renderTime}ms`);
    });
  }
};

// Debounce utility for scroll/resize events
export const debounce = (func, wait = 150) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for continuous events
export const throttle = (func, limit = 100) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
