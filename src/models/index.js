const sequelize = require('../config/database');

// Import models
const Category = require('./Category')(sequelize);
const Product = require('./Product')(sequelize);
const ProductImage = require('./ProductImage')(sequelize);
const ProductAttribute = require('./ProductAttribute')(sequelize);
const Review = require('./Review')(sequelize);
const QnA = require('./QnA')(sequelize);
const User = require('./User')(sequelize);
const UserAddress = require('./UserAddress')(sequelize);
const Order = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);
const Cart = require('./Cart')(sequelize);
const Wishlist = require('./Wishlist')(sequelize);

// Create models object
const models = {
  Category,
  Product,
  ProductImage,
  ProductAttribute,
  Review,
  QnA,
  User,
  UserAddress,
  Order,
  OrderItem,
  Cart,
  Wishlist
};

// Setup associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models
};