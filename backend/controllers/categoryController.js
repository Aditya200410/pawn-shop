const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../data/category.json');

// Helper function to read categories
const readCategories = async () => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data).categories;
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
};

// Helper function to write categories
const writeCategories = async (categories) => {
  try {
    await fs.writeFile(dataPath, JSON.stringify({ categories }, null, 2));
  } catch (error) {
    console.error('Error writing categories:', error);
    throw error;
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    let categories = await readCategories();
    // Ensure all fields are present and id is a string
    categories = categories.map(cat => ({
      id: String(cat.id),
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || ''
    }));
    res.json({ categories });
  } catch (error) {
    console.error('Error in getAllCategories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Get single category
exports.getCategory = async (req, res) => {
  try {
    const categories = await readCategories();
    const category = categories.find(c => c.id === parseInt(req.params.id));
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error in getCategory:', error);
    res.status(500).json({ message: 'Error fetching category' });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const categories = await readCategories();
    const newCategory = {
      id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
      name: req.body.name,
      description: req.body.description,
      image: req.body.image
    };

    categories.push(newCategory);
    await writeCategories(categories);
    
    console.log('New category created:', newCategory);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error in createCategory:', error);
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const categories = await readCategories();
    const index = categories.findIndex(c => c.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ message: 'Category not found' });
    }

    categories[index] = {
      ...categories[index],
      name: req.body.name,
      description: req.body.description,
      image: req.body.image
    };

    await writeCategories(categories);
    res.json(categories[index]);
  } catch (error) {
    console.error('Error in updateCategory:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const categories = await readCategories();
    const filteredCategories = categories.filter(c => c.id !== parseInt(req.params.id));
    
    if (filteredCategories.length === categories.length) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await writeCategories(filteredCategories);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
}; 