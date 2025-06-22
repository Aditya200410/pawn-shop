const fs = require('fs');
const path = require('path');

// Read existing shop.json
const shopPath = path.join(__dirname, '../pawnbackend/data/shop.json');
const shopData = JSON.parse(fs.readFileSync(shopPath, 'utf8'));

// Function to fix image path
function fixImagePath(imagePath) {
  if (!imagePath || typeof imagePath !== 'string') return imagePath;
  
  // If it's already correct format, return as is
  if (imagePath.startsWith('/pawnbackend/data/')) {
    return imagePath;
  }
  
  // If it starts with ../pawnbackend/data/, fix it
  if (imagePath.startsWith('../pawnbackend/data/')) {
    return imagePath.replace('../pawnbackend/data/', '/pawnbackend/data/');
  }
  
  // If it's just a filename, add the proper path
  if (!imagePath.includes('/')) {
    return `/pawnbackend/data/${imagePath}`;
  }
  
  return imagePath;
}

// Fix all image paths in the shop data
let fixedCount = 0;
shopData.forEach(product => {
  // Fix main image
  if (product.image) {
    const oldImage = product.image;
    product.image = fixImagePath(product.image);
    if (oldImage !== product.image) {
      console.log(`Fixed main image for ${product.name}: ${oldImage} -> ${product.image}`);
      fixedCount++;
    }
  }
  
  // Fix preview image
  if (product.preview) {
    const oldPreview = product.preview;
    product.preview = fixImagePath(product.preview);
    if (oldPreview !== product.preview) {
      console.log(`Fixed preview image for ${product.name}: ${oldPreview} -> ${product.preview}`);
      fixedCount++;
    }
  }
  
  // Fix images array
  if (product.images && Array.isArray(product.images)) {
    product.images = product.images.map(img => {
      const oldImg = img;
      const fixedImg = fixImagePath(img);
      if (oldImg !== fixedImg) {
        console.log(`Fixed array image for ${product.name}: ${oldImg} -> ${fixedImg}`);
        fixedCount++;
      }
      return fixedImg;
    });
  }
});

// Write updated shop.json
fs.writeFileSync(shopPath, JSON.stringify(shopData, null, 2));
console.log(`\nTotal image paths fixed: ${fixedCount}`);
console.log('All image paths have been standardized to work with fixImageUrl function!'); 