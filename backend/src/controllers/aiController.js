const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const aiService = require('../services/aiService');

const analyzeTransaction = asyncHandler(async (req, res) => {
  const { transaction } = req.body;
  if (!transaction) throw ApiError.badRequest('Missing transaction payload');
  const explanation = await aiService.analyzeTransaction(transaction);
  res.json({ explanation });
});

const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) throw ApiError.badRequest('Missing message');
  const response = await aiService.chat(message);
  res.json({ response });
});

module.exports = { analyzeTransaction, chat };
