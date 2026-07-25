const prisma = require('../config/db');

async function listCards(userId) {
  return prisma.card.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
}

async function createCard(userId, data) {
  return prisma.card.create({
    data: {
      userId,
      cardType: data.cardType,
      bank: data.bank,
      network: data.network,
      last4: data.last4,
    },
  });
}

module.exports = { listCards, createCard };
