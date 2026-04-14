// Image optimization utility
export const optimizeImageUrl = (url, width = 800, quality = 75) => {
  if (!url) return '';
  
  // If it's an unsplash URL, add optimization parameters
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=${quality}&fm=webp&fit=crop`;
  }
  
  // If it's a freepik or other CDN, return as is (add params if supported)
  return url;
};

// Lazy load images
export const lazyLoadImage = (imageRef) => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    if (imageRef.current) {
      imageObserver.observe(imageRef.current);
    }
  }
};

// Preload critical images
export const preloadImage = (url) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
};
