// src/routes/adminDashboardRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminDashboardController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Dashboard Summary
router.get('/summary', authenticate, requireAdmin, adminController.getDashboardSummary);

// Weekly Revenue
router.get('/revenue', authenticate, requireAdmin, adminController.getWeeklyRevenue);

// Sales by Category
router.get('/category-sales', authenticate, requireAdmin, adminController.getCategorySales);

// Top Products
router.get('/top-products', authenticate, requireAdmin, adminController.getTopProducts);

// Recent Orders
router.get('/recent-orders', authenticate, requireAdmin, adminController.getRecentOrders);

module.exports = router;
