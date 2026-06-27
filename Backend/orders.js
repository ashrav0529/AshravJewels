const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getModels } = require('../db');

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post('/', auth, async (req, res) => {
  const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ msg: 'No items in order' });
  }

  try {
    const { Order } = getModels();

    const newOrder = {
      userId: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'Processing'
    };

    const savedOrder = await Order.create(newOrder);
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error creating order:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/orders
// @desc    Get logged-in user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { Order } = getModels();
    
    // Find orders matching the authenticated user's ID
    const orders = await Order.find({ userId: req.user.id });
    
    // Sort orders by date descending (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
