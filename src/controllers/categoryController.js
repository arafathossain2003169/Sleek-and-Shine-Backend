// src/controllers/categoryController.js
const { Category, Product, sequelize } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const slugify = require('slugify');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM products
              WHERE products.category_id = "Category".id
              AND products.is_active = true
            )`),
            'productCount'
          ]
        ]
      },
      order: [['name', 'ASC']]
    });

    return successResponse(res, categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return errorResponse(res, error.message, 500);
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id, {
      include: [{
        model: Product,
        as: 'products',
        where: { isActive: true },
        required: false
      }]
    });

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    return successResponse(res, category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return errorResponse(res, error.message, 500);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    if (!name) {
      return errorResponse(res, 'Category name is required', 400);
    }

    const slug = slugify(name, { lower: true, strict: true });

    // Check if category with this name already exists
    const existingCategory = await Category.findOne({ where: { slug } });
    if (existingCategory) {
      return errorResponse(res, 'Category with this name already exists', 400);
    }

    const category = await Category.create({ 
      name, 
      slug, 
      description, 
      imageUrl 
    });

    return successResponse(res, category, 201);
  } catch (error) {
    console.error('Error creating category:', error);
    return errorResponse(res, error.message, 500);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await Category.findByPk(id);
    
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    if (updateData.name) {
      updateData.slug = slugify(updateData.name, { lower: true, strict: true });

      // Check if another category has this slug
      const existingCategory = await Category.findOne({ 
        where: { 
          slug: updateData.slug,
          id: { [sequelize.Op.ne]: id }
        } 
      });

      if (existingCategory) {
        return errorResponse(res, 'Category with this name already exists', 400);
      }
    }

    await category.update(updateData);
    return successResponse(res, category);
  } catch (error) {
    console.error('Error updating category:', error);
    return errorResponse(res, error.message, 500);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    
    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    // Check if category has products
    const productCount = await Product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return errorResponse(res, `Cannot delete category with ${productCount} products. Please reassign or delete the products first.`, 400);
    }

    await category.destroy();
    return successResponse(res, { message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return errorResponse(res, error.message, 500);
  }
};