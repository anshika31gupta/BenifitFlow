const asyncHandler = require('../utils/asyncHandler');
const transactionService = require('../services/transactionService');

const listTransactions = asyncHandler(async (req, res) => {
  const { category, status, search } = req.query;
  const transactions = await transactionService.listTransactions(req.user.id, { category, status, search });
  res.json({ success: true, data: transactions });
});

const getTransaction = asyncHandler(async (req, res) => {
  const tx = await transactionService.getTransaction(req.user.id, req.params.id);
  res.json({ success: true, data: tx });
});

const createTransaction = asyncHandler(async (req, res) => {
  const tx = await transactionService.createTransaction(req.user.id, req.body);
  res.status(201).json({ success: true, data: tx });
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const result = await transactionService.deleteTransaction(req.user.id, req.params.id);
  res.json({ success: true, data: result });
});

module.exports = { listTransactions, getTransaction, createTransaction, deleteTransaction };
