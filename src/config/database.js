// src/config/database.js
const { Sequelize } = require('sequelize');
const config = require('./environment');

const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port || 5432, // default to 5432
    dialect: 'postgres',
    logging: config.nodeEnv === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,       // Force SSL connection
        rejectUnauthorized: false // Needed for Neon self-signed certificates
      }
    }
  }
);

module.exports = sequelize;
