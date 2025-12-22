const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    orderNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: 'order_number'
    },

    // ✅ FIXED: attribute name used everywhere
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_id'
    },

    customerEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'customer_email'
    },

    customerName: {
      type: DataTypes.STRING(200),
      field: 'customer_name'
    },

    customerPhone: {
      type: DataTypes.STRING(20),
      field: 'customer_phone'
    },

    shippingAddressLine1: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'shipping_address_line1'
    },

    shippingAddressLine2: {
      type: DataTypes.STRING(255),
      field: 'shipping_address_line2'
    },

    shippingCity: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'shipping_city'
    },

    shippingState: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'shipping_state'
    },

    shippingZip: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'shipping_zip'
    },

    shippingCountry: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'shipping_country'
    },

    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    shippingCost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      field: 'shipping_cost'
    },

    tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },

    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    shippingMethod: {
      type: DataTypes.STRING(100),
      field: 'shipping_method'
    },

    estimatedDelivery: {
      type: DataTypes.DATEONLY,
      field: 'estimated_delivery'
    },

    paymentMethod: {
      type: DataTypes.STRING(50),
      field: 'payment_method'
    },

    bkashNumber: {
      type: DataTypes.STRING(20),
      field: 'bkash_number'
    },

    bkashTransactionId: {
      type: DataTypes.STRING(100),
      field: 'bkash_transaction_id'
    },

    paymentStatus: {
      type: DataTypes.STRING(50),
      defaultValue: 'pending',
      field: 'payment_status'
    },

    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'pending'
    },

    notes: {
      type: DataTypes.TEXT
    }

  }, {
    tableName: 'orders',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // ✅ FIXED ASSOCIATIONS
  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'userId', // ✅ MUST be attribute name
      as: 'user'
    });

    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId', // ✅ attribute name
      as: 'items'
    });
  };

  return Order;
};
