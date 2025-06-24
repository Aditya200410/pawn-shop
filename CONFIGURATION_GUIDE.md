# Configuration Guide

## SSL Configuration for GoDaddy Hosting

1. Purchase an SSL Certificate:
   - Log in to your GoDaddy account
   - Go to "SSL Certificates" section
   - Purchase an appropriate SSL certificate (recommend at least a Standard SSL)

2. Install the SSL Certificate:
   - Go to your GoDaddy cPanel
   - Navigate to "SSL/TLS" section
   - Click "Install SSL Certificate"
   - Follow the installation wizard
   - Wait for the certificate to be installed and activated

3. Force HTTPS Redirect:
   - In cPanel, go to "File Manager"
   - Navigate to your website's root directory
   - Create or edit `.htaccess` file
   - Add the following code:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

4. Update DNS Settings:
   - Go to your domain's DNS settings
   - Ensure all A records point to your secure hosting IP
   - Add or update any necessary CNAME records
   - Wait for DNS propagation (can take up to 48 hours)

5. Verify SSL Installation:
   - Visit your website using https://
   - Check for the padlock icon in the browser
   - Use SSL checker tools to verify proper installation
   - Test both www and non-www versions of your domain

## Common SSL Issues and Solutions

1. Mixed Content Warnings:
   - All resources (images, scripts, etc.) must be loaded over HTTPS
   - Update any hardcoded HTTP URLs in your code
   - Use relative URLs where possible
   - Check third-party resources and widgets

2. SSL Certificate Not Trusted:
   - Ensure certificate is from a trusted provider
   - Verify certificate matches domain name exactly
   - Check certificate expiration date
   - Install intermediate certificates if required

3. Performance Optimization with SSL:
   - Enable HTTP/2 in cPanel
   - Configure SSL session caching
   - Use HSTS preload if possible
   - Optimize SSL cipher suites

## Environment Variables

To enable image uploads in production, set the following environment variables:

- `CLOUDINARY_CLOUD_NAME=your_cloud_name`
- `CLOUDINARY_API_KEY=your_api_key`
- `CLOUDINARY_API_SECRET=your_api_secret`

## Security Headers

The application is configured with the following security headers:

```javascript
{
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}
```

## Troubleshooting

If you encounter SSL issues:

1. Clear browser cache and cookies
2. Check SSL certificate installation in GoDaddy cPanel
3. Verify DNS settings and propagation
4. Check for mixed content in browser console
5. Verify all API endpoints use HTTPS
6. Test SSL configuration using online SSL checker tools

For additional support, contact GoDaddy support or refer to their SSL documentation. 