// src/controllers/wishlistController.js
const { Wishlist, Product, ProductImage } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.query;

    const wishlistItems = await Wishlist.findAll({
      where: { userId },
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

    return successResponse(res, wishlistItems);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const [wishlistItem, created] = await Wishlist.findOrCreate({
      where: { userId, productId },
      defaults: { userId, productId }
    });

    if (!created) {
      return errorResponse(res, 'Product already in wishlist', 400);
    }

    const item = await Wishlist.findByPk(wishlistItem.id, {
      include: [{ model: Product, as: 'product' }]
    });

    return successResponse(res, item, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    const wishlistItem = await Wishlist.findByPk(id);
    if (!wishlistItem) {
      return errorResponse(res, 'Wishlist item not found', 404);
    }

    await wishlistItem.destroy();
    return successResponse(res, { message: 'Item removed from wishlist' });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
