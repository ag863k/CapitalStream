const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
  process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: 'postgres',
    logging: !isProduction,
    dialectOptions: isProduction ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 10,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    },
    retry: {
      max: 3
    }
  }
);

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    if (!isProduction) {
      console.error(error.stack);
    }
    return false;
  }
};

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: !isProduction });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Database sync failed:', error.message);
  }
};

module.exports = { sequelize, connectDatabase, syncDatabase };
