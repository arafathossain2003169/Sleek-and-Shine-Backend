// src/controllers/reviewController.js
const { Review, Product } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.createReview = async (req, res) => {
  try {
    const { productId, userId, reviewerName, rating, comment } = req.body;

    const review = await Review.create({
      productId,
      userId,
      reviewerName,
      rating,
      comment
    });

    // Update product rating
    const product = await Product.findByPk(productId, {
      include: [{ model: Review, as: 'reviews' }]
    });

    const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    await product.update({
      rating: avgRating.toFixed(2),
      reviewCount: product.reviews.length
    });

    return successResponse(res, review, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }

    await review.destroy();
    return successResponse(res, { message: 'Review deleted' });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};