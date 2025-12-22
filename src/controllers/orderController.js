// src/controllers/orderController.js
const { Order, OrderItem, Product, User } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { Op } = require('sequelize');

exports.getAllOrders = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return errorResponse(res, 'Unauthorized. Admin access required.', 403);
    }

    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { orderNumber: { [Op.iLike]: `%${search}%` } },
        { customerEmail: { [Op.iLike]: `%${search}%` } },
        { customerName: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price']
        }]
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    return errorResponse(res, error.message, 500);
  }
};

exports.getOrderById = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return errorResponse(res, 'Unauthorized. Admin access required.', 403);
    }

    const { id } = req.params;
    const order = await Order.findOne({
      where: { [Op.or]: [{ id }, { orderNumber: id }] },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }]
    });

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    return errorResponse(res, error.message, 500);
  }
};

exports.getUserOrderById = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return errorResponse(res, 'Unauthorized. Access required.', 403);
    }

    const { id } = req.params;
    const order = await Order.findOne({
      where: { [Op.or]: [{ id }, { orderNumber: id }] },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }]
    });

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    return errorResponse(res, error.message, 500);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    console.log(req.user);
    
    // Validate required fields
    if (!orderData.items || orderData.items.length === 0) {
      return errorResponse(res, 'Order must contain at least one item', 400);
    }

    if (!orderData.customerName || !orderData.customerPhone) {
      return errorResponse(res, 'Customer name and phone are required', 400);
    }

    // Generate order number
    orderData.orderNumber = `ORD-${Date.now()}`;
    
    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = orderData.shippingCost || (orderData.shippingMethod === 'express' ? 15 : 0);
    const tax = (subtotal + shipping) * 0.08;
    const total = subtotal + shipping + tax;

    // Add userId if user is authenticated
    if (req.user && req.user.id) {
      orderData.userId = req.user.id;
    }

    // Create order
    const order = await Order.create({
      orderNumber: orderData.orderNumber,
      userId: orderData.userId || null,
      customerEmail: orderData.customerEmail || null,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      shippingAddressLine1: orderData.shippingAddressLine1,
      shippingAddressLine2: orderData.shippingAddressLine2 || null,
      shippingCity: orderData.shippingCity,
      shippingState: orderData.shippingState,
      shippingZip: orderData.shippingZip,
      shippingCountry: orderData.shippingCountry,
      subtotal,
      shippingCost: shipping,
      tax,
      total,
      shippingMethod: orderData.shippingMethod,
      paymentMethod: orderData.paymentMethod,
      bkashNumber: orderData.bkashNumber || null,
      bkashTransactionId: orderData.bkashTransactionId || null,
      paymentStatus: 'pending',
      status: 'pending',
      notes: orderData.notes || null
    });

    // Create order items
    const orderItems = orderData.items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity
    }));

    await OrderItem.bulkCreate(orderItems);

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });

    return successResponse(res, completeOrder, 201);
  } catch (error) {
    console.error('Create order error:', error);
    return errorResponse(res, error.message, 500);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return errorResponse(res, 'Unauthorized. Admin access required.', 403);
    }

    const { id } = req.params;
    const { status } = req.body;

    console.log('Update status request:', { id, status, body: req.body, user: req.user });

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return errorResponse(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Update order status
    await order.update({ status });

    // Fetch updated order with items
    const updatedOrder = await Order.findByPk(id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }]
    });

    console.log('Status updated successfully:', { orderId: id, newStatus: status });

    return successResponse(res, updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    console.error('Error stack:', error.stack);
    return errorResponse(res, error.message, 500);
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return errorResponse(res, 'Unauthorized. Admin access required.', 403);
    }

    const { id } = req.params;
    const { paymentStatus } = req.body;

    console.log('Update payment status request:', { id, paymentStatus, body: req.body });

    // Validate payment status
    const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!paymentStatus || !validStatuses.includes(paymentStatus)) {
      return errorResponse(res, `Invalid payment status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    // Update payment status
    await order.update({ paymentStatus });

    // If payment is marked as paid and order is still pending, move to processing
    if (paymentStatus === 'paid' && order.status === 'pending') {
      await order.update({ status: 'processing' });
    }

    // Fetch updated order
    const updatedOrder = await Order.findByPk(id, {
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });

    console.log('Payment status updated successfully:', { orderId: id, newStatus: paymentStatus });

    return successResponse(res, updatedOrder);
  } catch (error) {
    console.error('Update payment status error:', error);
    console.error('Error stack:', error.stack);
    return errorResponse(res, error.message, 500);
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return errorResponse(res, 'Unauthorized. Admin access required.', 403);
    }

    const totalOrders = await Order.count();
    const completedOrders = await Order.count({ where: { status: 'completed' } });
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const totalRevenue = await Order.sum('total', { 
      where: { 
        status: { [Op.in]: ['completed', 'shipped'] } 
      } 
    });

    return successResponse(res, {
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue: totalRevenue || 0
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    return errorResponse(res, error.message, 500);
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    
    const orders = await Order.findAll({
      where: { userId },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price']
        }]
      }],
      order: [['created_at', 'DESC']]
    });
    
    return successResponse(res, orders);
  } catch (error) {
    console.error('Get orders by user error:', error);
    return errorResponse(res, error.message, 500);
  }
};