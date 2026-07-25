const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const { safeParse, safeStringify } = require('../utils/json');

function serialize(claim) {
  return {
    ...claim,
    dateSubmitted: claim.dateSubmitted?.toISOString().slice(0, 10),
    estimatedPayoutDate: claim.estimatedPayoutDate
      ? claim.estimatedPayoutDate.toISOString().slice(0, 10)
      : null,
    documentsAttached: safeParse(claim.documentsAttached, []),
    auditLog: safeParse(claim.auditLog, []),
  };
}

async function listClaims(userId) {
  const claims = await prisma.claim.findMany({
    where: { userId },
    orderBy: { dateSubmitted: 'desc' },
  });
  return claims.map(serialize);
}

async function submitClaim(userId, { transactionId, documentsAttached = [] }) {
  const tx = await prisma.transaction.findFirst({ where: { id: transactionId, userId } });
  if (!tx) throw ApiError.notFound('Transaction not found');

  const claimNumber = `BF-${Date.now().toString(36).toUpperCase()}`;
  const estimatedPayoutDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const claim = await prisma.claim.create({
    data: {
      claimNumber,
      userId,
      transactionId,
      merchant: tx.merchant,
      amount: tx.amount,
      benefitType: tx.detectedBenefit || 'Purchase Protection',
      cardUsed: tx.cardUsed,
      status: 'Claim Submitted',
      currentStepIndex: 1,
      documentsAttached: safeStringify(documentsAttached),
      payoutAmount: tx.benefitValue || 0,
      estimatedPayoutDate,
      auditLog: safeStringify([
        {
          timestamp: new Date().toISOString(),
          message: 'Claim auto-filed by BenefitFlow AI from detected transaction',
          actor: 'System AI',
        },
      ]),
    },
  });

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'Claim Submitted' },
  });

  return serialize(claim);
}

const STATUS_FLOW = ['Claim Submitted', 'Under Review', 'Approved', 'Paid Out'];

async function advanceClaim(userId, claimId, { status, message, actor = 'Adjuster' } = {}) {
  const claim = await prisma.claim.findFirst({ where: { id: claimId, userId } });
  if (!claim) throw ApiError.notFound('Claim not found');

  const nextStatus = status || STATUS_FLOW[Math.min(claim.currentStepIndex + 1, STATUS_FLOW.length - 1)];
  const nextIndex = STATUS_FLOW.indexOf(nextStatus);
  const log = safeParse(claim.auditLog, []);
  log.push({
    timestamp: new Date().toISOString(),
    message: message || `Claim status updated to ${nextStatus}`,
    actor,
  });

  const updated = await prisma.claim.update({
    where: { id: claimId },
    data: {
      status: nextStatus,
      currentStepIndex: Math.max(nextIndex, 0),
      auditLog: safeStringify(log),
    },
  });

  await prisma.transaction.update({
    where: { id: claim.transactionId },
    data: { status: nextStatus },
  });

  return serialize(updated);
}

module.exports = { listClaims, submitClaim, advanceClaim };
