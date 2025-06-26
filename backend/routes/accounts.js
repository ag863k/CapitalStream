const express = require('express');
const { body, validationResult } = require('express-validator');
const { Account, Transaction } = require('../models');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all accounts for the authenticated user
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.findAll({
      where: { userId: req.user.id, isActive: true },
      include: [
        {
          model: Transaction,
          as: 'transactions',
          limit: 5,
          order: [['transactionDate', 'DESC']]
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      accounts: accounts.map(account => ({
        id: account.id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        accountName: account.accountName,
        balance: parseFloat(account.balance),
        currency: account.currency,
        creditLimit: account.creditLimit ? parseFloat(account.creditLimit) : null,
        interestRate: parseFloat(account.interestRate),
        recentTransactions: account.transactions.map(tx => ({
          id: tx.id,
          type: tx.transactionType,
          amount: parseFloat(tx.amount),
          description: tx.description,
          date: tx.transactionDate,
          status: tx.status
        }))
      }))
    });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ message: 'Failed to fetch accounts', error: error.message });
  }
});

// Get specific account details
router.get('/:id', async (req, res) => {
  try {
    const account = await Account.findOne({
      where: { 
        id: req.params.id, 
        userId: req.user.id,
        isActive: true 
      },
      include: [
        {
          model: Transaction,
          as: 'transactions',
          order: [['transactionDate', 'DESC']],
          limit: 50
        }
      ]
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json({
      id: account.id,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      accountName: account.accountName,
      balance: parseFloat(account.balance),
      currency: account.currency,
      creditLimit: account.creditLimit ? parseFloat(account.creditLimit) : null,
      interestRate: parseFloat(account.interestRate),
      transactions: account.transactions.map(tx => ({
        id: tx.id,
        type: tx.transactionType,
        amount: parseFloat(tx.amount),
        description: tx.description,
        category: tx.category,
        merchant: tx.merchant,
        date: tx.transactionDate,
        status: tx.status,
        referenceNumber: tx.referenceNumber,
        balanceAfter: tx.balanceAfter ? parseFloat(tx.balanceAfter) : null
      }))
    });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({ message: 'Failed to fetch account', error: error.message });
  }
});

// Create new account (Admin only)
router.post('/', requireRole(['ADMIN']), [
  body('accountType').isIn(['CHECKING', 'SAVINGS', 'CREDIT']),
  body('accountName').trim().isLength({ min: 2 }),
  body('initialBalance').optional().isDecimal({ decimal_digits: '0,2' }),
  body('userId').isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { accountType, accountName, initialBalance = 0, userId, creditLimit, interestRate } = req.body;

    // Generate account number
    const accountNumber = `${accountType.substring(0, 3).toUpperCase()}${Date.now()}${Math.random().toString().substring(2, 8)}`;

    const account = await Account.create({
      userId,
      accountNumber,
      accountType,
      accountName,
      balance: initialBalance,
      creditLimit: accountType === 'CREDIT' ? creditLimit : null,
      interestRate: interestRate || 0
    });

    res.status(201).json({
      message: 'Account created successfully',
      account: {
        id: account.id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        accountName: account.accountName,
        balance: parseFloat(account.balance),
        currency: account.currency,
        creditLimit: account.creditLimit ? parseFloat(account.creditLimit) : null,
        interestRate: parseFloat(account.interestRate)
      }
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ message: 'Failed to create account', error: error.message });
  }
});

// Get account statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const account = await Account.findOne({
      where: { 
        id: req.params.id, 
        userId: req.user.id,
        isActive: true 
      }
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Get transaction statistics for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const transactions = await Transaction.findAll({
      where: {
        accountId: account.id,
        transactionDate: {
          [require('sequelize').Op.gte]: twelveMonthsAgo
        },
        status: 'COMPLETED'
      }
    });

    // Calculate monthly spending and income
    const monthlyData = {};
    const categories = {};

    transactions.forEach(tx => {
      const month = tx.transactionDate.toISOString().substring(0, 7); // YYYY-MM
      
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }

      const amount = parseFloat(tx.amount);
      if (tx.transactionType === 'CREDIT') {
        monthlyData[month].income += amount;
      } else {
        monthlyData[month].expenses += amount;
      }

      // Category breakdown
      if (tx.category) {
        categories[tx.category] = (categories[tx.category] || 0) + amount;
      }
    });

    res.json({
      accountId: account.id,
      currentBalance: parseFloat(account.balance),
      monthlyData,
      categoryBreakdown: categories,
      totalTransactions: transactions.length,
      period: '12 months'
    });
  } catch (error) {
    console.error('Get account stats error:', error);
    res.status(500).json({ message: 'Failed to fetch account statistics', error: error.message });
  }
});

module.exports = router;
