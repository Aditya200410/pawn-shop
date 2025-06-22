// Image loading utility for better performance
export const imageLoader = {
  // Preload images for better performance
  preloadImage: (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  },

  // Batch preload images
  preloadImages: async (imageUrls) => {
    const promises = imageUrls.map(url => imageLoader.preloadImage(url));
    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    }
  },

  // Get optimized image URL with fallback
  getOptimizedUrl: (originalUrl, fallbackUrl = 'https://placehold.co/400x400/e2e8f0/475569?text=Product+Image') => {
    if (!originalUrl) return fallbackUrl;
    
    // If it's already a full URL, return as is
    if (originalUrl.startsWith('http://') || originalUrl.startsWith('https://')) {
      return originalUrl;
    }
    
    return originalUrl;
  },

  // Lazy load image with intersection observer
  lazyLoadImage: (imgElement, src, fallbackSrc) => {
    if (!imgElement) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = src;
          img.onerror = () => {
            img.src = fallbackSrc;
          };
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    observer.observe(imgElement);
  }
};

// Cache for image loading
const imageCache = new Map();

export const cachedImageLoader = {
  load: async (src) => {
    if (imageCache.has(src)) {
      return imageCache.get(src);
    }

    try {
      const img = await imageLoader.preloadImage(src);
      imageCache.set(src, img);
      return img;
    } catch (error) {
      console.warn(`Failed to load image: ${src}`, error);
      throw error;
    }
  },

  clear: () => {
    imageCache.clear();
  }
}; 