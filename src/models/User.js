
// src/models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(100),
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(100),
      field: 'last_name'
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    role: {
      type: DataTypes.STRING(20),
      defaultValue: 'customer',
      validate: { isIn: [['customer', 'admin']] }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = (models) => {
    User.hasMany(models.Order, {
      foreignKey: 'user_id',
      as: 'orders'
    });
    User.hasMany(models.Review, {
      foreignKey: 'user_id',
      as: 'reviews'
    });
    User.hasMany(models.UserAddress, {
      foreignKey: 'user_id',
      as: 'addresses'
    });
    User.hasMany(models.Wishlist, {
      foreignKey: 'user_id',
      as: 'wishlist'
    });
    User.hasMany(models.Cart, {
      foreignKey: 'user_id',
      as: 'cart'
    });
  };

  return User;
};