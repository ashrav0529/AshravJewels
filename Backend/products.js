const express = require('express');
const router = express.Router();
const { getModels } = require('../db');

// @route   GET api/products
// @desc    Get all products (with optional search, category, and sort filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { Product } = getModels();
    
    // Fetch all products (works for both Mongoose and Mock JSON db)
    let products = await Product.find({});
    
    const { category, search, sort } = req.query;
    
    // Apply category filtering
    if (category && category !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    // Apply search query filtering
    if (search) {
      const query = search.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        (p.specifications && (
          (p.specifications.metal && p.specifications.metal.toLowerCase().includes(query)) ||
          (p.specifications.stone && p.specifications.stone.toLowerCase().includes(query))
        ))
      );
    }
    
    // Apply sorting
    if (sort) {
      if (sort === 'price_asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'newest') {
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }
    
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { Product } = getModels();
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(`Error fetching product ${req.params.id}:`, err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
