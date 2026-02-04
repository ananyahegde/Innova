const express = require('express');
const router = express.Router();
const OrderModel = require('../models/order.model');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate('userId')
      .populate('items.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one order
router.get('/:id', getOrder, (req, res) => {
  res.json(res.order);
});

// Create a new order
router.post('/', async (req, res) => {
  const order = new OrderModel(req.body);
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an order
router.patch('/:id', getOrder, async (req, res) => {
  Object.keys(req.body).forEach(key => {
    if (req.body[key] != null) {
      res.order[key] = req.body[key];
    }
  });
  try {
    const updatedOrder = await res.order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an order
router.delete('/:id', getOrder, async (req, res) => {
  try {
    await res.order.deleteOne();
    res.json({ message: 'Deleted Order' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get order by ID
async function getOrder(req, res, next) {
  let order;
  try {
    order = await OrderModel.findById(req.params.id)
      .populate('userId')
      .populate('items.productId');
    if (!order) return res.status(404).json({ message: 'Cannot find order' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.order = order;
  next();
}

module.exports = router;
