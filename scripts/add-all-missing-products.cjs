const fs = require('fs');
const path = require('path');

// Read existing shop.json
const shopPath = path.join(__dirname, '../pawnbackend/data/shop.json');
const shopData = JSON.parse(fs.readFileSync(shopPath, 'utf8'));

// Get existing product names to avoid duplicates
const existingProducts = new Set(shopData.map(product => product.name.toLowerCase()));

// Helper function to get all image files from a folder
function getImagesFromFolder(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    return files
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map(file => path.join(folderPath, file).replace(/\\/g, '/'))
      .map(filePath => filePath.replace(/^.*?pawnbackend\/data\//, '/pawnbackend/data/'));
  } catch (error) {
    console.log(`Error reading folder ${folderPath}:`, error.message);
    return [];
  }
}

// Helper function to generate product data
function generateProductData(id, folderName, category, subcategory, basePath) {
  const folderPath = path.join(basePath, folderName);
  const images = getImagesFromFolder(folderPath);
  
  if (images.length === 0) {
    console.log(`No images found in ${folderPath}`);
    return null;
  }

  // Clean up the name
  let name = folderName
    .replace(/DOKRA /g, '')
    .replace(/WOODEN /g, '')
    .replace(/TERRACOTTA /g, '')
    .replace(/HANDMADE /g, '')
    .replace(/JEWELLERY /g, '')
    .replace(/ART /g, '')
    .replace(/ITEMS /g, '')
    .replace(/CRAFT /g, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Generate price based on category and size
  let basePrice = 1500;
  if (category === 'Wooden Craft') basePrice = 2000;
  if (category === 'Dokra Art') basePrice = 2500;
  if (category === 'Terracotta Items') basePrice = 1200;
  
  // Adjust price based on name keywords
  if (name.toLowerCase().includes('big') || name.toLowerCase().includes('large')) basePrice += 500;
  if (name.toLowerCase().includes('small')) basePrice -= 300;
  if (name.toLowerCase().includes('pair')) basePrice += 400;
  if (name.toLowerCase().includes('set')) basePrice += 600;

  const price = Math.max(500, basePrice);
  const regularPrice = Math.round(price * 1.2);

  // Generate subcategory based on name
  let finalSubcategory = subcategory;
  if (name.toLowerCase().includes('ganesh') || name.toLowerCase().includes('durga') || name.toLowerCase().includes('krishna') || name.toLowerCase().includes('laxmi')) {
    finalSubcategory = 'Religious Items';
  } else if (name.toLowerCase().includes('horse') || name.toLowerCase().includes('deer') || name.toLowerCase().includes('elephant') || name.toLowerCase().includes('owl') || name.toLowerCase().includes('peacock')) {
    finalSubcategory = 'Animal Figurines';
  } else if (name.toLowerCase().includes('wall') || name.toLowerCase().includes('hanging')) {
    finalSubcategory = 'Wall Decor';
  } else if (name.toLowerCase().includes('tribal')) {
    finalSubcategory = 'Tribal Art';
  } else if (name.toLowerCase().includes('key') || name.toLowerCase().includes('ring')) {
    finalSubcategory = 'Accessories';
  }

  return {
    id,
    name,
    price,
    regularPrice,
    category,
    subcategory: finalSubcategory,
    image: images[0],
    preview: images[1] || images[0],
    color: category === 'Wooden Craft' ? 'Natural Wood' : 
           category === 'Dokra Art' ? 'Brass Metal' : 
           category === 'Terracotta Items' ? 'Terracotta' : 'Natural',
    size: name.toLowerCase().includes('big') ? 'Large' : 
          name.toLowerCase().includes('small') ? 'Small' : 'Medium',
    rating: 4.3 + Math.random() * 0.4,
    popularity: 4.2 + Math.random() * 0.5,
    reviews: Math.floor(20 + Math.random() * 50),
    inStock: true,
    outOfStock: false,
    description: `Beautiful ${category.toLowerCase()} ${name.toLowerCase()}, handcrafted with traditional techniques and perfect for home decoration.`,
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    images
  };
}

// Add missing Dokra Art products
const dokraBasePath = path.join(__dirname, '../pawnbackend/data/Rikocraft.com/DOKRA ART');
const dokraFolders = [
  'DOKRA TORTOISE HANDICRAFT',
  'DOKRA OWL DECORATIVE HOME DECOR',
  'DOKRA MAA DURGA',
  'DOKRA GANESH JI SMALL SET OF 3 HANDMADE',
  'DOKRA GANESH JI PLAY DHOLAK',
  'DOKRA GANESH JI PLAY BINA',
  'DOKRA GANESH JI PLAY BASURI',
  'DOKRA GANESH JI PLAY',
  'DOKRA GANESH FACE AAGARBATTI STAND',
  'DOKRA ELEPHANT HANDICRAFT',
  'DOKRA DIYA HANDMADE',
  'DOKRA DECORATIVE OWL',
  'DOKRA BULL HANDMADE',
  'DOKRA BRASS TRIBAL HANDICRAFT FOR DECORATIVE, GIFTING',
  'DOKRA BRASS METAL RADHA KRISHNA SET HANDICRAFT',
  'DOKRA BRASS METAL LAXMI MATA',
  'DOKRA BRASS METAL LAXMI GANESH BOTH',
  'DOKRA BRASS METAL HANDCRAFT PEACOCK WALL MOUNT',
  'DOKRA BRASS METAL HANDCRAFT KRISHNA WITH COW STAND',
  'DOKRA BRASS METAL GANESH  JI'
];

let nextId = shopData.length + 1;

dokraFolders.forEach(folderName => {
  const cleanName = folderName.replace(/DOKRA /g, '').toLowerCase();
  if (!existingProducts.has(cleanName)) {
    const product = generateProductData(nextId, folderName, 'Dokra Art', 'Traditional Art', dokraBasePath);
    if (product) {
      shopData.push(product);
      nextId++;
      console.log(`Added: ${product.name}`);
    }
  }
});

// Add missing Wooden Craft products
const woodenBasePath = path.join(__dirname, '../pawnbackend/data/Rikocraft.com/WOODEN CRAFT');
const woodenFolders = [
  'WOODEN BOAT',
  'WOODEN CARVERD FLSMINGO SCULPTURE',
  'WOODEN COW CAR WALK',
  'WOODEN DECORATIVE KEY HOLDER FOR WALL',
  'WOODEN DECORATIVE MULTI PERPUS STAND',
  'WOODEN DECORATIVE PEN STAND',
  'WOODEN DUCK',
  'WOODEN ELEPHANT FACE HANGING (H-21, LL-30)',
  'WOODEN GANESH KEY HANGER FOR WALL',
  'WOODEN HOUSE BOAT',
  'WOODEN LAXMI MATA',
  'WOODEN MAA DURGA WITH GLASS FRAME BOX',
  'WOODEN OWL',
  'WOODEN PREMIUM MULTI PERPUS STAND',
  'WOODEN SHOWPIECS COW CAR',
  'WOODEN SITTING CRANE PAIR',
  'WOODEN SMALL DECORATIVE HOME',
  'WOODEN SMALL HOME FOR HOME DECOR',
  'WOODEN SMALL SHOWPIECE COW CAR',
  'WOODEN SMALL SHOWPIECE IN VILLAGE',
  'WOODEN SMMAL SHOWPIECE',
  'WOODEN SOOP WITH MAA DURGA FACE'
];

woodenFolders.forEach(folderName => {
  const cleanName = folderName.replace(/WOODEN /g, '').toLowerCase();
  if (!existingProducts.has(cleanName)) {
    const product = generateProductData(nextId, folderName, 'Wooden Craft', 'Home Decor', woodenBasePath);
    if (product) {
      shopData.push(product);
      nextId++;
      console.log(`Added: ${product.name}`);
    }
  }
});

// Add missing Terracotta Items products
const terracottaBasePath = path.join(__dirname, '../pawnbackend/data/Rikocraft.com/TERRACOTTA ITEMS');
const terracottaFolders = [
  'HORSE PAIR',
  'KATHAKALI HORSE PAIR',
  'MAA DURGA',
  'SHANKH',
  'TERRACOTTA COUPLE',
  'TERRACOTTA COUPLE IN BLACK',
  'TERRACOTTA COUPLE SINGING',
  'TERRACOTTA ELEPHANT BLACK PAIR',
  'TERRACOTTA GANESH JI PLAY',
  'TERRACOTTA GANESH JI PLAY GUITER',
  'TERRACOTTA GANESH JI PLAY SITAR',
  'TERRACOTTA GANESH JI PLAY TABLA',
  'TERRACOTTA GANESH JI WALL HANGING WITH FRAME',
  'TERRACOTTA HORSE PAIR SMALL',
  'TERRACOTTA HORSE PAIR SMALL (H21 CM)',
  'TERRACOTTA KATHAKALI SMALL HORSE PAIR',
  'TERRACOTTA LADY SINGING',
  'TERRACOTTA MUMMY WITH CHILED',
  'TERRACOTTA TRIBAL BLACK MASK WALL HANGING CONBO',
  'TERRACOTTA TRIBAL MASK WALL HANGING HOME DECORATIVE COMBO',
  'TERRACOTTA TRIBAL PLAY DHOLAK',
  'TERRACOTTA TRIBAL PLAY GUITER',
  'TERRACOTTA TRIBAL PLAY HARMONIUM',
  'TERRACOTTA TRIBAL PLAY TABLA',
  'TERRACOTTA TRIBAL SINGING',
  'TERRACOTTA WALL HANGING RABINDRANATH THAKUR',
  'TERRRACOTTA GANESH JI PLAY HARMONIUM'
];

terracottaFolders.forEach(folderName => {
  const cleanName = folderName.replace(/TERRACOTTA /g, '').toLowerCase();
  if (!existingProducts.has(cleanName)) {
    const product = generateProductData(nextId, folderName, 'Terracotta Items', 'Traditional Art', terracottaBasePath);
    if (product) {
      shopData.push(product);
      nextId++;
      console.log(`Added: ${product.name}`);
    }
  }
});

// Write updated shop.json
fs.writeFileSync(shopPath, JSON.stringify(shopData, null, 2));
console.log(`\nTotal products in shop.json: ${shopData.length}`);
console.log('All missing products have been added successfully!'); 