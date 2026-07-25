const prisma = require('../config/db');
const { safeParse } = require('../utils/json');
const { matchTransaction } = require('./benefitMatcherService');
const { serialize: serializeTx } = require('./transactionService');

function serializePolicy(p) {
  return {
    ...p,
    eligibleCards: safeParse(p.eligibleCards, []),
    requiredDocs: safeParse(p.requiredDocs, []),
  };
}

async function listPolicies() {
  const policies = await prisma.benefitPolicy.findMany({ orderBy: { title: 'asc' } });
  return policies.map(serializePolicy);
}

// Dry-run check: evaluate a raw transaction payload against active rules
// without persisting anything (used by POST /benefits/check).
async function checkBenefits(transactionPayload) {
  const pseudoTransaction = {
    amount: transactionPayload.amount,
    category: transactionPayload.category,
    cardUsed: transactionPayload.cardUsed,
    date: transactionPayload.date || new Date().toISOString(),
  };
  return matchTransaction(pseudoTransaction, transactionPayload.bank || null);
}

module.exports = { listPolicies, checkBenefits };
