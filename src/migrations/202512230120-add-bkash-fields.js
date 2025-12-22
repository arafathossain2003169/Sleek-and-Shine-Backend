// src/migrations/XXXXXXXXXXXXXX-add-bkash-fields-to-orders.js
// Name this file with timestamp: 20241223XXXXXX-add-bkash-fields-to-orders.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add bkash_number column
    await queryInterface.addColumn('orders', 'bkash_number', {
      type: Sequelize.STRING(20),
      allowNull: true
    });

    // Add bkash_transaction_id column
    await queryInterface.addColumn('orders', 'bkash_transaction_id', {
      type: Sequelize.STRING(100),
      allowNull: true
    });

    // Make customer_email nullable since it's now optional
    await queryInterface.changeColumn('orders', 'customer_email', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'bkash_number');
    await queryInterface.removeColumn('orders', 'bkash_transaction_id');
    
    await queryInterface.changeColumn('orders', 'customer_email', {
      type: Sequelize.STRING(255),
      allowNull: false
    });
  }
};