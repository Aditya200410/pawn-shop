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
    
    return imageFiles.map(file => path.join(folderPath, file).replace(/\\/g, '/'));
  } catch (error) {
    console.log(`Error reading folder ${folderPath}:`, error.message);
    return [];
  }
}

// Update each product
shopData.forEach((product, index) => {
  // Skip if already has images array
  if (product.images) {
    console.log(`Product ${product.id} already has images array`);
    return;
  }
  
  // Extract folder path from image field
  const imagePath = product.image;
  // Remove the /pawnbackend/data/ prefix and get the folder path
  const relativePath = imagePath.replace('/pawnbackend/data/', '');
  const folderPath = path.dirname(relativePath);
  const fullFolderPath = path.join(rikocraftPath, folderPath);
  
  // Get all images from the folder
  const images = getImagesFromFolder(fullFolderPath);
  
  if (images.length > 0) {
    // Convert back to the proper format for the JSON
    const jsonImages = images.map(imgPath => {
      const relativeImgPath = imgPath.replace(rikocraftPath.replace(/\\/g, '/'), '');
      return `/pawnbackend/data${relativeImgPath}`;
    });
    product.images = jsonImages;
    console.log(`Updated product ${product.id} with ${images.length} images`);
  } else {
    console.log(`No images found for product ${product.id} in ${fullFolderPath}`);
  }
});

// Write back to file
fs.writeFileSync(shopDataPath, JSON.stringify(shopData, null, 2));
console.log('Updated shop.json with images arrays for all products'); 