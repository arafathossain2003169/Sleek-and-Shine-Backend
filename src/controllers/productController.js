const { Product, ProductImage, ProductAttribute, Review, QnA, Category } = require('../models');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { Op } = require('sequelize');
const slugify = require('slugify');

// Get all products with filtering, sorting, and pagination
exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { isActive: true };

    // Category filter
    if (category) {
      const categoryRecord = await Category.findOne({ where: { slug: category } });
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      }
    }

    // Search filter
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Price range filter
    if (minPrice) where.price = { ...where.price, [Op.gte]: minPrice };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isPrimary'],
          separate: true,
          order: [['displayOrder', 'ASC']]
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]],
      distinct: true
    });

    return successResponse(res, {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return errorResponse(res, error.message, 500);
  }
};

// Get single product by ID or slug
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const where = isNaN(id) ? { slug: id } : { id };

    const product = await Product.findOne({
      where,
      include: [
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isPrimary', 'displayOrder'],
          order: [['displayOrder', 'ASC']]
        },
        {
          model: ProductAttribute,
          as: 'attributes',
          attributes: ['id', 'attributeName', 'attributeValue']
        },
        {
          model: Review,
          as: 'reviews',
          attributes: ['id', 'reviewerName', 'rating', 'comment', 'created_at'],
          separate: true,
          order: [['created_at', 'DESC']]
        },
        {
          model: QnA,
          as: 'qna',
          attributes: ['id', 'question', 'answer', 'created_at'],
          separate: true
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ]
    });

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    return successResponse(res, product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    return errorResponse(res, error.message, 500);
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Generate slug from name
    if (!productData.slug) {
      productData.slug = slugify(productData.name, { lower: true, strict: true });
    }

    // Create product
    const product = await Product.create(productData);

    // Add images if provided
    if (productData.images && productData.images.length > 0) {
      const imagePromises = productData.images.map((img, index) => 
        ProductImage.create({
          productId: product.id,
          imageUrl: img.url,
          cloudinaryId: img.cloudinaryId,
          isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
          displayOrder: img.displayOrder !== undefined ? img.displayOrder : index
        })
      );
      await Promise.all(imagePromises);
    }

    // Add attributes if provided
    if (productData.attributes && productData.attributes.length > 0) {
      const attrPromises = productData.attributes.map(attr => 
        ProductAttribute.create({
          productId: product.id,
          attributeName: attr.name,
          attributeValue: attr.value
        })
      );
      await Promise.all(attrPromises);
    }

    // Fetch the complete product with associations
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductAttribute, as: 'attributes' },
        { model: Category, as: 'category' }
      ]
    });

    return successResponse(res, createdProduct, 201);
  } catch (error) {
    console.error('Error in createProduct:', error);
    return errorResponse(res, error.message, 500);
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Update slug if name changed
    if (updateData.name && updateData.name !== product.name) {
      updateData.slug = slugify(updateData.name, { lower: true, strict: true });
    }

    await product.update(updateData);

    // Update images if provided
    if (updateData.images) {
      await ProductImage.destroy({ where: { productId: id } });
      const imagePromises = updateData.images.map((img, index) => 
        ProductImage.create({
          productId: id,
          imageUrl: img.url,
          cloudinaryId: img.cloudinaryId,
          isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
          displayOrder: img.displayOrder !== undefined ? img.displayOrder : index
        })
      );
      await Promise.all(imagePromises);
    }

    // Update attributes if provided
    if (updateData.attributes) {
      await ProductAttribute.destroy({ where: { productId: id } });
      const attrPromises = updateData.attributes.map(attr => 
        ProductAttribute.create({
          productId: id,
          attributeName: attr.name,
          attributeValue: attr.value
        })
      );
      await Promise.all(attrPromises);
    }

    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductAttribute, as: 'attributes' },
        { model: Category, as: 'category' }
      ]
    });

    return successResponse(res, updatedProduct);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return errorResponse(res, error.message, 500);
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Soft delete by setting isActive to false
    await product.update({ isActive: false });

    return successResponse(res, { message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return errorResponse(res, error.message, 500);
  }
};

// Get product statistics for admin dashboard
exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.count({ where: { isActive: true } });
    const totalStock = await Product.sum('stock', { where: { isActive: true } });
    const totalSales = await Product.sum('salesCount', { where: { isActive: true } });
    
    const lowStockProducts = await Product.count({
      where: {
        isActive: true,
        stock: { [Op.lt]: 10 }
      }
    });

    return successResponse(res, {
      totalProducts,
      totalStock: totalStock || 0,
      totalSales: totalSales || 0,
      lowStockProducts
    });
  } catch (error) {
    console.error('Error in getProductStats:', error);
    return errorResponse(res, error.message, 500);
  }
};