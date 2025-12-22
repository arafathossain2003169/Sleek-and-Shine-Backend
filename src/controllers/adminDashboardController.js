// src/controllers/adminDashboardController.js
const { Order, OrderItem, Product, User, Category } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

exports.getDashboardSummary = async (req, res) => {
  try {
    const totalRevenue = await Order.sum('total');
    const totalOrders = await Order.count();
    const totalProducts = await Product.count();
    const totalCustomers = await User.count();

    res.json({ totalRevenue, totalOrders, totalProducts, totalCustomers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch dashboard summary' });
  }
};

// Weekly Revenue (last 7 days)
exports.getWeeklyRevenue = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueData = await Order.findAll({
      attributes: [
        [fn('TO_CHAR', col('created_at'), 'Dy'), 'name'], // Postgres day abbreviation
        [fn('SUM', col('total')), 'value'],
      ],
      where: {
        created_at: {
          [Op.gte]: sevenDaysAgo,
        },
      },
      group: ['name'],
      order: literal(`MIN("created_at") ASC`),
      raw: true,
    });

    res.json(revenueData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch weekly revenue' });
  }
};

// Sales by Category
exports.getCategorySales = async (req, res) => {
  try {
    const salesData = await OrderItem.findAll({
      attributes: [
        [fn('SUM', col('quantity')), 'value'],
        [col('product.category.name'), 'name'],
      ],
      include: [
        {
          model: Product,
          as: 'product', // matches association alias in OrderItem
          attributes: [],
          include: [
            {
              model: Category,
              as: 'category', // matches Product->Category alias
              attributes: [],
            },
          ],
        },
      ],
      group: ['product.category.name'],
      raw: true,
    });

    res.json(salesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch category sales' });
  }
};

// Top Products
exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await OrderItem.findAll({
      attributes: [
        [col('product.name'), 'name'], // Use alias 'product' exactly
        [fn('SUM', col('OrderItem.quantity')), 'sales'],
        [fn('SUM', col('OrderItem.subtotal')), 'revenue'],
      ],
      include: [
        {
          model: Product,
          as: 'product', // Must match association alias
          attributes: [], // We already selected 'name'
        },
      ],
      group: ['product.id', 'product.name'],
      order: [[literal('sales'), 'DESC']],
      limit: 5,
      raw: true,
    });

    res.json(topProducts);
  } catch (error) {
    console.error('getTopProducts error:', error);
    res.status(500).json({ message: 'Failed to fetch top products' });
  }
};


// Recent Orders
exports.getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user', // matches association alias in Order->User
          attributes: ['firstName', 'lastName', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 5,
    });

    res.json(
      recentOrders.map((order) => ({
        id: order.orderNumber,
        customer: order.user
          ? `${order.user.firstName} ${order.user.lastName}`
          : order.customerName || order.customerEmail,
        amount: order.total,
        status: order.status,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch recent orders' });
  }
};
