const { Product, Category, OrderItem, ProductImage } = require('../models');
const { Op } = require('sequelize');

// Get categories with product count
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id'],
        },
      ],
    });

    const result = categories.map((c) => ({
      id: c.id,
      name: c.name,
      count: c.products.length,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get brands with product count
exports.getBrands = async (req, res) => {
  try {
    const brands = await Product.findAll({
      attributes: [
        'brand',
        [Product.sequelize.fn('COUNT', Product.sequelize.col('id')), 'count'],
      ],
      group: ['brand'],
      where: { brand: { [Op.not]: null } }, // optional: exclude null brands
    });

    const result = brands.map((b) => ({
      id: b.brand,
      name: b.brand,
      count: Number(b.get('count')),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products filtered by categories, brands, price range
exports.getFilteredProducts = async (req, res) => {
  try {
    let { categories, brands, minPrice = 0, maxPrice = 10000 } = req.query;

    // Ensure categories and brands are arrays
    if (categories && !Array.isArray(categories)) {
      categories = categories.split(','); // split by comma if sent as "1,2,3"
    }
    if (brands && !Array.isArray(brands)) {
      brands = brands.split(',');
    }

    const where = {};

    if (categories && categories.length > 0) where.categoryId = { [Op.in]: categories.map(Number) };
    if (brands && brands.length > 0) where.brand = { [Op.in]: brands };
    where.price = { [Op.between]: [Number(minPrice), Number(maxPrice)] };

    const products = await Product.findAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: ProductImage,
          as: 'images',       // alias as used in Product associations
          attributes: ['id', 'imageUrl', 'isPrimary', 'displayOrder'],
          order: [['displayOrder', 'ASC']]
        }
      ]
    });

    // Optional: sort images so that primary image comes first
    const formattedProducts = products.map((p) => {
      const images = p.images || [];
      images.sort((a, b) => b.isPrimary - a.isPrimary || a.displayOrder - b.displayOrder);
      return { ...p.toJSON(), images };
    });

    res.json(formattedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

