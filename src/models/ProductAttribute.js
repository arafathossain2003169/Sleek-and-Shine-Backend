// src/models/ProductAttribute.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductAttribute = sequelize.define('ProductAttribute', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id'
    },
    attributeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'attribute_name'
    },
    attributeValue: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'attribute_value'
    }
  }, {
    tableName: 'product_attributes',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  ProductAttribute.associate = (models) => {
    ProductAttribute.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return ProductAttribute;
};