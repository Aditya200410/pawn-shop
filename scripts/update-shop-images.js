import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get all image files from a directory
function getImageFiles(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    }).map(file => path.join(dirPath, file));
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
    return [];
  }
}

// Function to update shop.json with all images
function updateShopJson() {
  const shopJsonPath = path.join(__dirname, '../pawnbackend/data/shop.json');
  const dataDir = path.join(__dirname, '../pawnbackend/data/Rikocraft.com');
  
  try {
    // Read current shop.json
    const shopData = JSON.parse(fs.readFileSync(shopJsonPath, 'utf8'));
    
    // Update each product with all its images
    const updatedShopData = shopData.map(product => {
      // Extract the relative path from the current image
      const currentImagePath = product.image;
      const relativePath = currentImagePath.replace('/pawnbackend/data/', '');
      const productDir = path.join(dataDir, relativePath.split('/').slice(2, -1).join('/'));
      
      // Get all images from the product directory
      const imageFiles = getImageFiles(productDir);
      
      if (imageFiles.length > 0) {
        // Convert to the format expected by the frontend
        const images = imageFiles.map(imgPath => {
          const relativeImgPath = path.relative(path.join(__dirname, '../pawnbackend/data'), imgPath);
          return '/' + relativeImgPath.replace(/\\/g, '/');
        });
        
        return {
          ...product,
          image: images[0], // Keep the first image as the main image
          images: images,   // Add all images array
          preview: images[0] // Keep preview as first image
        };
      }
      
      return product;
    });
    
    // Write updated data back to shop.json
    fs.writeFileSync(shopJsonPath, JSON.stringify(updatedShopData, null, 2));
    console.log('✅ shop.json updated successfully with all product images!');
    
    // Log summary
    const productsWithMultipleImages = updatedShopData.filter(p => p.images && p.images.length > 1);
    console.log(`📊 Found ${productsWithMultipleImages.length} products with multiple images`);
    
  } catch (error) {
    console.error('❌ Error updating shop.json:', error.message);
  }
}

// Run the update
updateShopJson(); 