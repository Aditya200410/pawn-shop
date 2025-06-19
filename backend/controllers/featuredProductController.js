const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../data/featuredProducts.json');

// Helper function to read data
const readData = async () => {
  const data = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write data
const writeData = async (data) => {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
};

// Get all featured products
const getAllFeaturedProducts = async (req, res) => {
  try {
    const data = await readData();
    res.json(data.featuredProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured products" });
  }
};

// Get single featured product
const getFeaturedProduct = async (req, res) => {
  try {
    const data = await readData();
    const product = data.featuredProducts.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({ message: "Featured product not found" });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured product" });
  }
};

// Create new featured product
const createFeaturedProduct = async (req, res) => {
  try {
    const data = await readData();
    const newProduct = {
      id: data.featuredProducts.length + 1,
      ...req.body
    };
    
    data.featuredProducts.push(newProduct);
    await writeData(data);
    
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating featured product" });
  }
};

// Update featured product
const updateFeaturedProduct = async (req, res) => {
  try {
    const data = await readData();
    const index = data.featuredProducts.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ message: "Featured product not found" });
    }
    
    data.featuredProducts[index] = {
      ...data.featuredProducts[index],
      ...req.body,
      id: parseInt(req.params.id)
    };
    
    await writeData(data);
    res.json(data.featuredProducts[index]);
  } catch (error) {
    res.status(500).json({ message: "Error updating featured product" });
  }
};

// Delete featured product
const deleteFeaturedProduct = async (req, res) => {
  try {
    const data = await readData();
    const index = data.featuredProducts.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ message: "Featured product not found" });
    }
    
    data.featuredProducts.splice(index, 1);
    await writeData(data);
    
    res.json({ message: "Featured product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting featured product" });
  }
};

module.exports = {
  getAllFeaturedProducts,
  getFeaturedProduct,
  createFeaturedProduct,
  updateFeaturedProduct,
  deleteFeaturedProduct
}; 