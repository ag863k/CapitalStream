const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  accountType: {
    type: DataTypes.ENUM('CHECKING', 'SAVINGS', 'CREDIT'),
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  accountName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  creditLimit: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  interestRate: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0.0000
  }
}, {
  timestamps: true
});

module.exports = Account;
