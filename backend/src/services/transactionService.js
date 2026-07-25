const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const { safeParse, safeStringify } = require('../utils/json');
const { matchAndPersist } = require('./benefitMatcherService');

function serialize(tx) {
  return {
    ...tx,
    date: tx.date?.toISOString().slice(0, 10),
    claimDeadline: tx.claimDeadline ? tx.claimDeadline.toISOString().slice(0, 10) : null,
    reasoningChain: safeParse(tx.reasoningChain, []),
  };
}

async function listTransactions(userId, { category, status, search } = {}) {
  const where = {
    userId,
    ...(category && category !== 'All' ? { category } : {}),
    ...(status && status !== 'All' ? { status } : {}),
    ...(search
      ? { merchant: { contains: search } }
      : {}),
  };
  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
  });
  return transactions.map(serialize);
}

async function getTransaction(userId, id) {
  const tx = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!tx) throw ApiError.notFound('Transaction not found');
  return serialize(tx);
}

async function createTransaction(userId, data, source = 'manual') {
  const card = data.cardId
    ? await prisma.card.findFirst({ where: { id: data.cardId, userId } })
    : await prisma.card.findFirst({ where: { userId, cardType: data.cardUsed } });

  const tx = await prisma.transaction.create({
    data: {
      userId,
      cardId: card?.id || null,
      merchant: data.merchant,
      logo: data.logo || null,
      amount: data.amount,
      category: data.category,
      date: data.date ? new Date(data.date) : new Date(),
      cardUsed: data.cardUsed || card?.cardType || 'Unknown',
      cardLast4: data.cardLast4 || card?.last4 || '0000',
      location: data.location || null,
      paymentMode: data.paymentMode || 'Card',
      source,
    },
  });

  await matchAndPersist(tx.id);
  return getTransaction(userId, tx.id);
}

async function deleteTransaction(userId, id) {
  const tx = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!tx) throw ApiError.notFound('Transaction not found');
  await prisma.transaction.delete({ where: { id } });
  return { id };
}

module.exports = { listTransactions, getTransaction, createTransaction, deleteTransaction, serialize };
