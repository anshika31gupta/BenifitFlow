const prisma = require('../config/db');
const { serialize } = require('./transactionService');

async function getDashboard(userId) {
  const transactions = await prisma.transaction.findMany({ where: { userId } });
  const claims = await prisma.claim.findMany({ where: { userId } });

  const totalTransactions = transactions.length;
  const matchedBenefits = transactions.filter((t) => t.hasBenefit).length;
  const unclaimedValue = transactions
    .filter((t) => t.hasBenefit && t.status === 'Detected')
    .reduce((sum, t) => sum + (t.benefitValue || 0), 0);
  const totalSaved = claims
    .filter((c) => ['Approved', 'Under Review', 'Claim Submitted', 'Paid Out'].includes(c.status))
    .reduce((sum, c) => sum + (c.payoutAmount || 0), 0);

  const byCategory = {};
  for (const t of transactions) {
    byCategory[t.category] = (byCategory[t.category] || 0) + 1;
  }
  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(serialize);

  const benefitTimeline = transactions
    .filter((t) => t.hasBenefit)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((t) => ({
      id: t.id,
      merchant: t.merchant,
      date: t.date.toISOString().slice(0, 10),
      benefit: t.detectedBenefit,
      value: t.benefitValue,
      status: t.status,
    }));

  return {
    totalTransactions,
    matchedBenefits,
    unclaimedValue,
    totalSaved,
    topCategory,
    recentTransactions,
    benefitTimeline,
  };
}

module.exports = { getDashboard };
