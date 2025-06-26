const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Transaction, Account } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Get transactions with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('accountId').optional().isUUID(),
  query('type').optional().isIn(['DEBIT', 'CREDIT', 'TRANSFER']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('category').optional().trim(),
  query('minAmount').optional().isDecimal(),
  query('maxAmount').optional().isDecimal()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      page = 1,
      limit = 20,
      accountId,
      type,
      startDate,
      endDate,
      category,
      minAmount,
      maxAmount,
      search
    } = req.query;

    // Build where clause
    const where = {};
    
    // Only show transactions for user's accounts
    const userAccounts = await Account.findAll({
      where: { userId: req.user.id, isActive: true },
      attributes: ['id']
    });
    
    const userAccountIds = userAccounts.map(acc => acc.id);
    where.accountId = { [Op.in]: userAccountIds };

    if (accountId && userAccountIds.includes(accountId)) {
      where.accountId = accountId;
    }

    if (type) {
      where.transactionType = type;
    }

    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate[Op.gte] = new Date(startDate);
      if (endDate) where.transactionDate[Op.lte] = new Date(endDate);
    }

    if (category) {
      where.category = { [Op.iLike]: `%${category}%` };
    }

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount[Op.gte] = parseFloat(minAmount);
      if (maxAmount) where.amount[Op.lte] = parseFloat(maxAmount);
    }

    if (search) {
      where[Op.or] = [
        { description: { [Op.iLike]: `%${search}%` } },
        { merchant: { [Op.iLike]: `%${search}%` } },
        { referenceNumber: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where,
      include: [
        {
          model: Account,
          as: 'account',
          attributes: ['accountNumber', 'accountName', 'accountType']
        }
      ],
      order: [['transactionDate', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      transactions: transactions.map(tx => ({
        id: tx.id,
        type: tx.transactionType,
        amount: parseFloat(tx.amount),
        description: tx.description,
        category: tx.category,
        merchant: tx.merchant,
        date: tx.transactionDate,
        status: tx.status,
        referenceNumber: tx.referenceNumber,
        balanceAfter: tx.balanceAfter ? parseFloat(tx.balanceAfter) : null,
        account: {
          number: tx.account.accountNumber,
          name: tx.account.accountName,
          type: tx.account.accountType
        }
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
});

// Get specific transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Account,
          as: 'account',
          where: { userId: req.user.id },
          attributes: ['accountNumber', 'accountName', 'accountType']
        },
        {
          model: Account,
          as: 'fromAccount',
          required: false,
          attributes: ['accountNumber', 'accountName', 'accountType']
        },
        {
          model: Account,
          as: 'toAccount',
          required: false,
          attributes: ['accountNumber', 'accountName', 'accountType']
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({
      id: transaction.id,
      type: transaction.transactionType,
      amount: parseFloat(transaction.amount),
      description: transaction.description,
      category: transaction.category,
      merchant: transaction.merchant,
      date: transaction.transactionDate,
      status: transaction.status,
      referenceNumber: transaction.referenceNumber,
      balanceAfter: transaction.balanceAfter ? parseFloat(transaction.balanceAfter) : null,
      account: {
        number: transaction.account.accountNumber,
        name: transaction.account.accountName,
        type: transaction.account.accountType
      },
      fromAccount: transaction.fromAccount ? {
        number: transaction.fromAccount.accountNumber,
        name: transaction.fromAccount.accountName,
        type: transaction.fromAccount.accountType
      } : null,
      toAccount: transaction.toAccount ? {
        number: transaction.toAccount.accountNumber,
        name: transaction.toAccount.accountName,
        type: transaction.toAccount.accountType
      } : null
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ message: 'Failed to fetch transaction', error: error.message });
  }
});

// Create new transaction
router.post('/', [
  body('accountId').isUUID(),
  body('transactionType').isIn(['DEBIT', 'CREDIT', 'TRANSFER']),
  body('amount').isDecimal({ decimal_digits: '0,2' }),
  body('description').trim().isLength({ min: 1 }),
  body('category').optional().trim(),
  body('merchant').optional().trim(),
  body('toAccountId').optional().isUUID()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      accountId,
      transactionType,
      amount,
      description,
      category,
      merchant,
      toAccountId
    } = req.body;

    // Verify account belongs to user
    const account = await Account.findOne({
      where: { id: accountId, userId: req.user.id, isActive: true }
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const transactionAmount = parseFloat(amount);

    // For debit transactions, check if sufficient balance
    if (transactionType === 'DEBIT') {
      const currentBalance = parseFloat(account.balance);
      if (currentBalance < transactionAmount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
    }

    // Calculate new balance
    let newBalance = parseFloat(account.balance);
    if (transactionType === 'DEBIT') {
      newBalance -= transactionAmount;
    } else if (transactionType === 'CREDIT') {
      newBalance += transactionAmount;
    }

    // Create transaction
    const transactionData = {
      accountId,
      transactionType,
      amount: transactionAmount,
      description,
      category,
      merchant,
      balanceAfter: newBalance
    };

    // Handle transfer
    if (transactionType === 'TRANSFER' && toAccountId) {
      const toAccount = await Account.findOne({
        where: { id: toAccountId, userId: req.user.id, isActive: true }
      });

      if (!toAccount) {
        return res.status(404).json({ message: 'Destination account not found' });
      }

      transactionData.toAccountId = toAccountId;
      transactionData.fromAccountId = accountId;

      // Update destination account balance
      const toAccountNewBalance = parseFloat(toAccount.balance) + transactionAmount;
      await toAccount.update({ balance: toAccountNewBalance });

      // Create corresponding credit transaction for destination account
      await Transaction.create({
        accountId: toAccountId,
        transactionType: 'CREDIT',
        amount: transactionAmount,
        description: `Transfer from ${account.accountName}`,
        category: 'Transfer',
        balanceAfter: toAccountNewBalance,
        fromAccountId: accountId,
        toAccountId: toAccountId
      });
    }

    const transaction = await Transaction.create(transactionData);

    // Update account balance
    await account.update({ balance: newBalance });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: {
        id: transaction.id,
        type: transaction.transactionType,
        amount: parseFloat(transaction.amount),
        description: transaction.description,
        category: transaction.category,
        merchant: transaction.merchant,
        date: transaction.transactionDate,
        status: transaction.status,
        referenceNumber: transaction.referenceNumber,
        balanceAfter: parseFloat(transaction.balanceAfter)
      }
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Failed to create transaction', error: error.message });
  }
});

// Get transaction categories for filtering
router.get('/meta/categories', async (req, res) => {
  try {
    const userAccounts = await Account.findAll({
      where: { userId: req.user.id, isActive: true },
      attributes: ['id']
    });
    
    const userAccountIds = userAccounts.map(acc => acc.id);

    const categories = await Transaction.findAll({
      where: {
        accountId: { [Op.in]: userAccountIds },
        category: { [Op.not]: null }
      },
      attributes: ['category'],
      group: ['category'],
      order: [['category', 'ASC']]
    });

    res.json({
      categories: categories.map(cat => cat.category).filter(Boolean)
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
});

module.exports = router;
