# 🎯 Centralized Configuration System

## ✅ Currently Configured for Local Development

All frontend and admin panel configurations are now set to use **localhost:5000** for local development.

## Quick Switch Between Environments

To change the backend URL across the entire application, you only need to modify **3 files**:

### 1. Frontend Config
**File:** `src/config/config.js`
```javascript
API_BASE_URL: 'http://localhost:5000', // ← Currently set for local development
```

### 2. Admin Panel Config  
**File:** `pawnbackend/pawnadmin/src/config/config.js`
```javascript
API_BASE_URL: 'http://localhost:5000', // ← Currently set for local development
```

### 3. Vite Proxy Config
**File:** `pawnbackend/pawnadmin/vite.config.js`
```javascript
const API_BASE_URL = 'http://localhost:5000'; // ← Currently set for local development
```

## 🚀 Environment Examples

### Local Development (Current)
```javascript
API_BASE_URL: 'http://localhost:5000'
```

### Production
```javascript
API_BASE_URL: 'https://pawnbackend-xmqa.onrender.com'
```

### Staging
```javascript
API_BASE_URL: 'https://your-staging-url.com'
```

## 🔄 Quick Environment Switching

Use the provided script to quickly switch environments:

```bash
# Switch to production
node scripts/switch-env.js production

# Switch back to local development
node scripts/switch-env.js local

# Switch to staging (with custom URL)
node scripts/switch-env.js staging https://your-staging-url.com
```

## 📁 What's Been Updated

✅ **Frontend Services:**
- `src/services/api.js`
- `src/services/cartService.js` 
- `src/services/authService.js`

✅ **Frontend Pages:**
- `src/pages/Orders.jsx`
- `src/pages/Shop.jsx`
- `src/pages/ProductView.jsx`
- `src/pages/Account.jsx`

✅ **Frontend Components:**
- `src/components/Products/FeaturedProducts.jsx`
- `src/components/Products/WeeklyBestsellers.jsx`
- `src/components/Products/MostLoved.jsx`
- `src/components/Categories/Categories.jsx`
- `src/components/Checkout.jsx`

✅ **Admin Panel:**
- `pawnbackend/pawnadmin/src/components/Dashboard.jsx`
- `pawnbackend/pawnadmin/src/pages/EditLoved.jsx`
- `pawnbackend/pawnadmin/src/components/Categories/CategoryList.jsx`
- `pawnbackend/pawnadmin/vite.config.js`

## 🎉 Benefits

- **Single Point of Control**: Change URL in 3 places instead of 20+ files
- **Consistency**: All API calls use the same configuration
- **Easy Maintenance**: No more hunting for hardcoded URLs
- **Quick Environment Switching**: Switch between dev/staging/prod in seconds

## 🚨 Important Notes

- **Make sure your backend server is running on localhost:5000**
- **Restart your development servers** after switching environments
- **Test API calls** after switching to ensure connectivity

## 📖 Detailed Guide

See `CONFIGURATION_GUIDE.md` for complete documentation and advanced usage. 