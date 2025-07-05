// MSG91 Script Loader Utility
// Handles loading MSG91 script without conflicts

let msg91ScriptLoaded = false;
let msg91ScriptLoading = false;

export const loadMSG91Script = () => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (msg91ScriptLoaded && window.initSendOTP) {
      resolve();
      return;
    }

    // If already loading, wait for it
    if (msg91ScriptLoading) {
      const checkInterval = setInterval(() => {
        if (msg91ScriptLoaded && window.initSendOTP) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src="https://verify.msg91.com/otp-provider.js"]');
    if (existingScript) {
      msg91ScriptLoading = true;
      const checkInterval = setInterval(() => {
        if (window.initSendOTP) {
          clearInterval(checkInterval);
          msg91ScriptLoaded = true;
          msg91ScriptLoading = false;
          resolve();
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        msg91ScriptLoading = false;
        reject(new Error('MSG91 script loading timeout'));
      }, 10000);
      return;
    }

    // Load the script
    msg91ScriptLoading = true;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://verify.msg91.com/otp-provider.js';
    
    script.onload = () => {
      console.log('MSG91 script loaded successfully');
      // Wait a bit for the script to initialize
      setTimeout(() => {
        if (window.initSendOTP) {
          msg91ScriptLoaded = true;
          msg91ScriptLoading = false;
          resolve();
        } else {
          msg91ScriptLoading = false;
          reject(new Error('MSG91 widget not available after script load'));
        }
      }, 1000);
    };
    
    script.onerror = (error) => {
      console.error('MSG91 script loading error:', error);
      msg91ScriptLoading = false;
      reject(new Error('Failed to load MSG91 script'));
    };

    // Add error handling for script conflicts
    script.addEventListener('error', (error) => {
      console.error('MSG91 script error event:', error);
      msg91ScriptLoading = false;
      reject(new Error('MSG91 script error'));
    });

    document.head.appendChild(script);
  });
};

export const initializeMSG91Widget = (config) => {
  return new Promise((resolve, reject) => {
    if (!window.initSendOTP) {
      reject(new Error('MSG91 widget not available'));
      return;
    }

    try {
      // Enhanced error handling for IP blocked and other issues
      const enhancedConfig = {
        ...config,
        failure: (error) => {
          console.error('MSG91 widget failure:', error);
          
          // Handle specific error codes
          if (error.code === '408' || error.message?.includes('IPBlocked')) {
            console.error('MSG91 IP Blocked Error - Please check API key and IP whitelist');
            if (config.failure) {
              config.failure({
                ...error,
                userMessage: 'MSG91 service temporarily unavailable. Please try again later or contact support.'
              });
            }
          } else if (error.code === '401' || error.message?.includes('Unauthorized')) {
            console.error('MSG91 Authentication Error - Invalid API key');
            if (config.failure) {
              config.failure({
                ...error,
                userMessage: 'Authentication failed. Please contact support.'
              });
            }
          } else {
            // Generic error handling
            if (config.failure) {
              config.failure({
                ...error,
                userMessage: 'OTP verification failed. Please try again.'
              });
            }
          }
          reject(error);
        },
        success: (data) => {
          console.log('MSG91 widget success:', data);
          if (config.success) {
            config.success(data);
          }
          resolve(data);
        }
      };

      window.initSendOTP(enhancedConfig);
    } catch (error) {
      console.error('MSG91 widget initialization error:', error);
      reject(error);
    }
  });
};

export const isMSG91Available = () => {
  return msg91ScriptLoaded && !!window.initSendOTP;
}; 