import fs from 'fs';
import path from 'path';

const shopDataPath = '../pawnbackend/data/shop.json';
const rikocraftPath = '../pawnbackend/data/Rikocraft.com';

// Read the current shop.json
const shopData = JSON.parse(fs.readFileSync(shopDataPath, 'utf8'));

// Function to get all image files from a product folder
function getImagesFromFolder(folderPath) {
  try {
    if (!fs.existsSync(folderPath)) {
      console.log(`Folder not found: ${folderPath}`);
      return [];
    }
    
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    return imageFiles.map(file => `/pawnbackend/data${path.join(folderPath, file).replace(/\\/g, '/').replace(rikocraftPath.replace(/\\/g, '/'), '')}`);
  } catch (error) {
    console.log(`Error reading folder ${folderPath}:`, error.message);
    return [];
  }
}

// Function to get folder path from product image path
function getFolderPathFromImage(imagePath) {
  // Extract the folder path from the image path
  const parts = imagePath.split('/');
  const categoryIndex = parts.findIndex(part => part === 'Rikocraft.com');
  if (categoryIndex === -1) return null;
  
  // Get the category and product folder
  const category = parts[categoryIndex + 1];
  const productFolder = parts[categoryIndex + 2];
  
  return path.join(rikocraftPath, category, productFolder);
}

// Update products that don't have images array
let updatedCount = 0;
const updatedProducts = shopData.map(product => {
  // If product already has images array, skip it
  if (product.images && Array.isArray(product.images)) {
    return product;
  }
  
  // Get folder path from the main image
  const folderPath = getFolderPathFromImage(product.image);
  if (!folderPath) {
    console.log(`Could not determine folder path for product ${product.id}: ${product.name}`);
    return product;
  }
  
  // Get all images from the folder
  const images = getImagesFromFolder(folderPath);
  
  if (images.length > 0) {
    console.log(`Added ${images.length} images to product ${product.id}: ${product.name}`);
    updatedCount++;
    return {
      ...product,
      images: images
    };
  } else {
    console.log(`No images found for product ${product.id}: ${product.name}`);
    return product;
  }
});

// Write the updated data back to the file
fs.writeFileSync(shopDataPath, JSON.stringify(updatedProducts, null, 2));

console.log(`\nUpdate complete!`);
console.log(`Updated ${updatedCount} products with images array.`);
console.log(`Total products: ${shopData.length}`); 