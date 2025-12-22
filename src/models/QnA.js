// src/models/QnA.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QnA = sequelize.define('QnA', {
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
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    answer: {
      type: DataTypes.TEXT
    },
    askedBy: {
      type: DataTypes.INTEGER,
      field: 'asked_by'
    },
    answeredAt: {
      type: DataTypes.DATE,
      field: 'answered_at'
    }
  }, {
    tableName: 'product_qna',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  QnA.associate = (models) => {
    QnA.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
    QnA.belongsTo(models.User, {
      foreignKey: 'asked_by',
      as: 'asker'
    });
  };

  return QnA;
};