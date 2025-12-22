require('dotenv').config();

const app = require('./src/app');
const { sequelize } = require('./src/models');
const config = require('./src/config/environment');

const PORT = config.port;

// Test database connection and start server
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully');
    
    // Sync models (use {force: false} in production)
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Database models synchronized');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api/${config.apiVersion}`);
    });
  })
  .catch((error) => {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});