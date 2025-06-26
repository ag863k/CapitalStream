const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  transactionType: {
    type: DataTypes.ENUM('DEBIT', 'CREDIT', 'TRANSFER'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  merchant: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transactionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'),
    defaultValue: 'COMPLETED'
  },
  referenceNumber: {
    type: DataTypes.STRING,
    unique: true
  },
  balanceAfter: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (transaction) => {
      if (!transaction.referenceNumber) {
        transaction.referenceNumber = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      }
    }
  }
});

module.exports = Transaction;
