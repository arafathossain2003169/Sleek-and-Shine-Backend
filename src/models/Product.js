// src/models/Product.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 }
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'original_price',
      validate: { min: 0 }
    },
    sku: {
      type: DataTypes.STRING(100),
      unique: true
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      field: 'category_id'
    },
    brand: {
      type: DataTypes.STRING(100)
    },
    ingredients: {
      type: DataTypes.TEXT
    },
    weight: {
      type: DataTypes.STRING(50)
    },
    color: {
      type: DataTypes.STRING(100)
    },
    shelfLife: {
      type: DataTypes.STRING(50),
      field: 'shelf_life'
    },
    salesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'sales_count'
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.0,
      validate: { min: 0, max: 5 }
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'review_count'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    tableName: 'products',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
    Product.hasMany(models.ProductImage, {
      foreignKey: 'product_id',
      as: 'images'
    });
    Product.hasMany(models.ProductAttribute, {
      foreignKey: 'product_id',
      as: 'attributes'
    });
    Product.hasMany(models.Review, {
      foreignKey: 'product_id',
      as: 'reviews'
    });
    Product.hasMany(models.QnA, {
      foreignKey: 'product_id',
      as: 'qna'
    });
  };

  return Product;
};