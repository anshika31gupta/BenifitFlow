const asyncHandler = require('../utils/asyncHandler');
const cardService = require('../services/cardService');

const listCards = asyncHandler(async (req, res) => {
  const cards = await cardService.listCards(req.user.id);
  res.json({ success: true, data: cards });
});

const createCard = asyncHandler(async (req, res) => {
  const card = await cardService.createCard(req.user.id, req.body);
  res.status(201).json({ success: true, data: card });
});

module.exports = { listCards, createCard };
