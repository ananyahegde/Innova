const express = require('express');
const router = express.Router();
const ProductModel = require('../models/product.model');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Handle products.html with query parameter - MUST BE BEFORE /:id route
router.get('/products.html', async (req, res) => {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'ID parameter required' });
  }
  
  try {
    const product = await ProductModel.findOne({ id: parseInt(id) });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one product by MongoDB _id (URL parameter)
router.get('/:id', getProduct, (req, res) => {
  res.json(res.product);
});

// Create a new product
router.post('/', async (req, res) => {
  const product = new ProductModel(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a product
router.patch('/:id', getProduct, async (req, res) => {
  Object.keys(req.body).forEach(key => {
    if (req.body[key] != null) {
      res.product[key] = req.body[key];
    }
  });
  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/:id', getProduct, async (req, res) => {
  try {
    await res.product.deleteOne();
    res.json({ message: 'Deleted Product' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get product by MongoDB _id
async function getProduct(req, res, next) {
  let product;
  try {
    product = await ProductModel.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: 'Cannot find product' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.product = product;
  next();
}

module.exports = router;