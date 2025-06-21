#!/usr/bin/env node

/**
 * Environment Switching Utility
 * 
 * Usage:
 *   node scripts/switch-env.js local
 *   node scripts/switch-env.js production
 *   node scripts/switch-env.js staging <url>
 */

const fs = require('fs');
const path = require('path');

const environments = {
  local: 'http://localhost:5000',
  production: 'https://pawnbackend-xmqa.onrender.com',
  staging: process.argv[3] || 'https://your-staging-url.com'
};

const configFiles = [
  'src/config/config.js',
  'pawnbackend/pawnadmin/src/config/config.js',
  'pawnbackend/pawnadmin/vite.config.js'
];

function updateConfigFile(filePath, newUrl, env) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (filePath.includes('vite.config.js')) {
      // Update Vite config
      content = content.replace(
        /const API_BASE_URL = ['"`][^'"`]*['"`];/,
        `const API_BASE_URL = '${newUrl}';`
      );
    } else {
      // Update regular config files
      content = content.replace(
        /API_BASE_URL: ['"`][^'"`]*['"`],/,
        `API_BASE_URL: '${newUrl}',`
      );
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

function main() {
  const env = process.argv[2];
  
  if (!env || !environments[env]) {
    console.log('Usage: node scripts/switch-env.js <environment>');
    console.log('Available environments:');
    Object.keys(environments).forEach(key => {
      console.log(`  ${key}: ${environments[key]}`);
    });
    console.log('\n💡 Currently set to: https://pawnbackend-xmqa.onrender.com (deployed backend)');
    process.exit(1);
  }
  
  const newUrl = environments[env];
  console.log(`🔄 Switching to ${env} environment: ${newUrl}`);
  
  configFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      updateConfigFile(filePath, newUrl, env);
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  });
  
  console.log('\n🎉 Environment switch complete!');
  console.log('💡 Remember to restart your development server if needed.');
}

main(); 