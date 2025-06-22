// Performance testing script for the pawn shop application
const performanceTest = {
  // Test page load time
  testPageLoad: () => {
    const startTime = performance.now();
    
    return new Promise((resolve) => {
      window.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
        resolve(loadTime);
      });
    });
  },

  // Test API response time
  testAPIResponse: async (url) => {
    const startTime = performance.now();
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      const responseTime = performance.now() - startTime;
      
      console.log(`API response time for ${url}: ${responseTime.toFixed(2)}ms`);
      return { responseTime, data };
    } catch (error) {
      console.error(`API test failed for ${url}:`, error);
      return { responseTime: null, error };
    }
  },

  // Test image loading time
  testImageLoad: (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      const startTime = performance.now();
      
      img.onload = () => {
        const loadTime = performance.now() - startTime;
        console.log(`Image load time for ${imageUrl}: ${loadTime.toFixed(2)}ms`);
        resolve(loadTime);
      };
      
      img.onerror = () => {
        console.error(`Image failed to load: ${imageUrl}`);
        resolve(null);
      };
      
      img.src = imageUrl;
    });
  },

  // Test cache performance
  testCachePerformance: () => {
    const cacheSize = localStorage.length;
    const cacheKeys = Object.keys(localStorage);
    
    console.log(`Cache size: ${cacheSize} items`);
    console.log('Cache keys:', cacheKeys);
    
    return { cacheSize, cacheKeys };
  },

  // Run comprehensive performance test
  runComprehensiveTest: async () => {
    console.log('🚀 Starting Performance Test...');
    
    // Test page load
    const pageLoadTime = await performanceTest.testPageLoad();
    
    // Test API endpoints
    const apiEndpoints = [
      'https://pawnbackend-xmqa.onrender.com/api/featured-products',
      'https://pawnbackend-xmqa.onrender.com/api/loved',
      'https://pawnbackend-xmqa.onrender.com/api/shop'
    ];
    
    const apiResults = await Promise.all(
      apiEndpoints.map(url => performanceTest.testAPIResponse(url))
    );
    
    // Test cache
    const cacheResults = performanceTest.testCachePerformance();
    
    // Calculate average API response time
    const validApiTimes = apiResults
      .filter(result => result.responseTime !== null)
      .map(result => result.responseTime);
    
    const avgApiTime = validApiTimes.length > 0 
      ? validApiTimes.reduce((a, b) => a + b, 0) / validApiTimes.length 
      : 0;
    
    console.log('\n📊 Performance Summary:');
    console.log(`Page Load Time: ${pageLoadTime.toFixed(2)}ms`);
    console.log(`Average API Response Time: ${avgApiTime.toFixed(2)}ms`);
    console.log(`Cache Items: ${cacheResults.cacheSize}`);
    
    // Performance recommendations
    console.log('\n💡 Performance Recommendations:');
    
    if (pageLoadTime > 3000) {
      console.log('⚠️  Page load time is slow. Consider:');
      console.log('   - Implementing code splitting');
      console.log('   - Optimizing bundle size');
      console.log('   - Using CDN for static assets');
    }
    
    if (avgApiTime > 1000) {
      console.log('⚠️  API response time is slow. Consider:');
      console.log('   - Implementing better caching');
      console.log('   - Optimizing database queries');
      console.log('   - Using a CDN for API responses');
    }
    
    if (cacheResults.cacheSize === 0) {
      console.log('⚠️  No cache detected. Consider:');
      console.log('   - Implementing localStorage caching');
      console.log('   - Using service workers for offline support');
    }
    
    return {
      pageLoadTime,
      avgApiTime,
      cacheSize: cacheResults.cacheSize,
      apiResults
    };
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.performanceTest = performanceTest;
}

// Auto-run test if this script is loaded
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  setTimeout(() => {
    performanceTest.runComprehensiveTest();
  }, 2000);
}

module.exports = performanceTest; 