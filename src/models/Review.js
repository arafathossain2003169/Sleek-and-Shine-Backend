// src/models/Review.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
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
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id'
    },
    reviewerName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'reviewer_name'
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    comment: {
      type: DataTypes.TEXT
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified'
    }
  }, {
    tableName: 'reviews',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
    Review.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Review;
};