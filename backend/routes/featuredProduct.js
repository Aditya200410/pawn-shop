const express = require('express');
const router = express.Router();
const featuredProductController = require('../controllers/featuredProductController');

// Get all featured products
router.get('/', featuredProductController.getAllFeaturedProducts);

// Get single featured product
router.get('/:id', featuredProductController.getFeaturedProduct);

// Create new featured product
router.post('/', featuredProductController.createFeaturedProduct);

// Update featured product
router.put('/:id', featuredProductController.updateFeaturedProduct);

// Delete featured product
router.delete('/:id', featuredProductController.deleteFeaturedProduct);

module.exports = router; 