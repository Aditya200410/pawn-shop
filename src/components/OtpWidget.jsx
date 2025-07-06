import { useEffect } from 'react';

const OtpWidget = ({ phone, onSuccess, onFailure }) => {
  useEffect(() => {
    console.log('🚀 Initializing MSG91 OTP Widget for phone:', phone);
    
    // Get MSG91 configuration from environment variables
    const widgetId = import.meta.env.VITE_MSG91_WIDGET_ID;
    const tokenAuth = import.meta.env.VITE_MSG91_TOKEN_AUTH;
    
    console.log('📋 MSG91 Configuration:', {
      widgetId: widgetId ? '✅ Set' : '❌ Missing',
      tokenAuth: tokenAuth ? '✅ Set' : '❌ Missing',
      phone: phone || '❌ Missing'
    });

    if (!widgetId || !tokenAuth) {
      const error = 'MSG91 configuration missing. Please check environment variables.';
      console.error('❌', error);
      onFailure({ message: error });
      return;
    }

    if (!phone) {
      const error = 'Phone number is required for OTP verification.';
      console.error('❌', error);
      onFailure({ message: error });
      return;
    }

    const configuration = {
      widgetId: widgetId,
      tokenAuth: tokenAuth,
      identifier: phone,
      exposeMethods: true,
      // hCaptcha configuration to fix the missing captcha error
      captcha: {
        type: 'hcaptcha',
        sitekey: '10000000-ffff-ffff-ffff-000000000001', // Test sitekey
        theme: 'light',
        size: 'normal'
      },
      success: (data) => {
        console.log('✅ MSG91 OTP verification successful:', {
          token: data?.token ? '✅ Present' : '❌ Missing',
          data: data
        });
        
        if (data?.token) {
          console.log('🎯 Passing token to parent component');
          onSuccess(data.token);
        } else {
          console.warn('⚠️ No token received from MSG91 success callback');
          onFailure({ message: 'No verification token received from MSG91' });
        }
      },
      failure: (error) => {
        console.error('❌ MSG91 OTP verification failed:', {
          error: error,
          message: error?.message || 'Unknown error',
          code: error?.code || 'No code'
        });
        onFailure(error);
      },
    };

    console.log('🔧 Loading MSG91 script...');
    
    const script = document.createElement('script');
    script.src = 'https://verify.msg91.com/otp-provider.js';
    script.type = 'text/javascript';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ MSG91 script loaded successfully');
      
      if (window.initSendOTP) {
        console.log('🚀 Initializing MSG91 widget with configuration');
        window.initSendOTP(configuration);
      } else {
        const error = 'MSG91 initSendOTP function not found';
        console.error('❌', error);
        onFailure({ message: error });
      }
    };

    script.onerror = (error) => {
      const errorMsg = 'Failed to load MSG91 script';
      console.error('❌', errorMsg, error);
      onFailure({ message: errorMsg });
    };

    document.body.appendChild(script);

    return () => {
      console.log('🧹 Cleaning up MSG91 script');
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [phone, onSuccess, onFailure]);

  return <div id="otp-widget" />;
};

export default OtpWidget;
