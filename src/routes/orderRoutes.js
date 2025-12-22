// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

// Public route - Create order (checkout)
router.post('/', authenticate, orderController.createOrder);

// Protected route - User's own orders
router.get('/user', authenticate, orderController.getOrdersByUser);

// Admin routes - These should come BEFORE the /:id route to avoid conflicts
router.get('/stats', authenticate, orderController.getOrderStats);

// Update routes - MUST come before /:id route
router.patch('/:id/status', authenticate, orderController.updateOrderStatus);
router.patch('/:id/payment-status', authenticate, orderController.updatePaymentStatus);

// Get routes
router.get('/', authenticate, orderController.getAllOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.get('/user/:id', authenticate, orderController.getUserOrderById);

module.exports = router;