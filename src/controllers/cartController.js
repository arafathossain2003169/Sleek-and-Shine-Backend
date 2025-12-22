// src/controllers/cartController.js
const { Cart, Product, ProductImage } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getCart = async (req, res) => {
  try {
    const { userId, sessionId } = req.query;
    const where = userId ? { userId } : { sessionId };

    const cartItems = await Cart.findAll({
      where,
      include: [{
        model: Product,
        as: 'product',
        include: [{
          model: ProductImage,
          as: 'images',
          where: { isPrimary: true },
          required: false
        }]
      }]
    });

    return successResponse(res, cartItems);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { userId, sessionId, productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    if (product.stock < quantity) {
      return errorResponse(res, 'Insufficient stock', 400);
    }

    const where = userId ? { userId, productId } : { sessionId, productId };
    const [cartItem, created] = await Cart.findOrCreate({
      where,
      defaults: { userId, sessionId, productId, quantity }
    });

    if (!created) {
      await cartItem.update({ quantity: cartItem.quantity + quantity });
    }

    const updatedItem = await Cart.findByPk(cartItem.id, {
      include: [{ model: Product, as: 'product' }]
    });

    return successResponse(res, updatedItem, created ? 201 : 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await Cart.findByPk(id);
    if (!cartItem) {
      return errorResponse(res, 'Cart item not found', 404);
    }

    await cartItem.update({ quantity });
    return successResponse(res, cartItem);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findByPk(id);
    if (!cartItem) {
      return errorResponse(res, 'Cart item not found', 404);
    }

    await cartItem.destroy();
    return successResponse(res, { message: 'Item removed from cart' });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { userId, sessionId } = req.query;
    const where = userId ? { userId } : { sessionId };

    await Cart.destroy({ where });
    return successResponse(res, { message: 'Cart cleared' });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};