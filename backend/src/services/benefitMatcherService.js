const prisma = require('../config/db');
const { safeStringify } = require('../utils/json');

/**
 * BenefitMatcher
 * ----------------
 * Given a transaction, evaluates it against every active RuleDefinition
 * and produces MatchedBenefit records (with a reason, confidence score
 * and coverage window) plus a mirror on the Transaction row so list/
 * dashboard queries don't need a join for the common case.
 *
 * Matching logic (in order):
 *  1. Category match       - rule.ifCategory === transaction.category ("Any" wildcard allowed)
 *  2. Card match            - rule.ifCard === transaction.cardUsed ("Any" wildcard allowed)
 *  3. Bank match             - rule.ifBank (optional) === transaction card's bank
 *  4. Amount threshold      - transaction.amount >= rule.ifMinAmount
 *  5. Date / eligibility    - transaction not older than 12 months (coverage windows are finite)
 *
 * Confidence score is computed from how many optional signals aligned
 * (category+card+amount are mandatory; bank match and recency add points).
 */

const MAX_TRANSACTION_AGE_DAYS = 365;

function matchesWildcard(ruleValue, actualValue) {
  if (!ruleValue) return true;
  if (ruleValue.toLowerCase() === 'any') return true;
  return ruleValue.toLowerCase() === String(actualValue || '').toLowerCase();
}

function daysBetween(a, b) {
  return Math.abs((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

function evaluateRule(rule, transaction, cardBank) {
  const categoryOk = matchesWildcard(rule.ifCategory, transaction.category);
  const cardOk = matchesWildcard(rule.ifCard, transaction.cardUsed);
  const bankOk = matchesWildcard(rule.ifBank, cardBank);
  const amountOk = transaction.amount >= rule.ifMinAmount;
  const ageDays = daysBetween(new Date(), new Date(transaction.date));
  const recentOk = ageDays <= MAX_TRANSACTION_AGE_DAYS;

  const eligible = categoryOk && cardOk && amountOk && recentOk && (bankOk || !rule.ifBank);
  if (!eligible) return null;

  // Confidence: mandatory signals are worth 70, bank match +15, recency +15
  let confidence = 70;
  if (rule.ifBank && bankOk) confidence += 15;
  if (ageDays <= 30) confidence += 15;
  else if (ageDays <= 90) confidence += 8;
  confidence = Math.min(confidence, 99);

  const reasonParts = [
    `${transaction.category} purchase of ₹${transaction.amount.toLocaleString('en-IN')} on ${transaction.cardUsed}`,
    `meets ${rule.ifCategory === 'Any' ? 'any-category' : rule.ifCategory} rule threshold (min ₹${rule.ifMinAmount.toLocaleString('en-IN')})`,
    `qualifying for "${rule.thenBenefitTitle}"`,
  ];

  const coverageLimit = Math.round((transaction.amount * rule.thenCoveragePct) / 100);

  return {
    ruleId: rule.id,
    benefitTitle: rule.thenBenefitTitle,
    reason: reasonParts.join(', '),
    confidenceScore: Math.round(confidence),
    coverageWindowDays: rule.coverageDays,
    coverageLimit,
  };
}

/**
 * Runs every active rule against a transaction and returns the best matches
 * (sorted by confidence, highest first). Does not write to the DB - pure
 * function so it can be unit tested and reused for "dry run" checks.
 */
async function matchTransaction(transaction, cardBank = null) {
  const rules = await prisma.ruleDefinition.findMany({ where: { active: true } });
  const results = rules
    .map((rule) => evaluateRule(rule, transaction, cardBank))
    .filter(Boolean)
    .sort((a, b) => b.confidenceScore - a.confidenceScore);
  return results;
}

/**
 * Runs the matcher and persists MatchedBenefit rows + updates the
 * transaction's hasBenefit/detectedBenefit/confidenceScore/coverageLimit
 * summary fields (used everywhere the frontend reads a flat Transaction).
 */
async function matchAndPersist(transactionId) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { card: true },
  });
  if (!transaction) return [];

  const matches = await matchTransaction(transaction, transaction.card?.bank || null);

  // Clear previous matches for idempotency (e.g. re-run after rule edit)
  await prisma.matchedBenefit.deleteMany({ where: { transactionId } });

  const created = [];
  for (const match of matches) {
    const policy = await prisma.benefitPolicy.findFirst({
      where: { title: match.benefitTitle },
    });

    const record = await prisma.matchedBenefit.create({
      data: {
        transactionId,
        benefitPolicyId: policy?.id || null,
        ruleId: match.ruleId,
        reason: match.reason,
        confidenceScore: match.confidenceScore,
        coverageWindowDays: match.coverageWindowDays,
        coverageLimit: match.coverageLimit,
      },
    });
    created.push(record);

    if (policy) {
      await prisma.benefitPolicy.update({
        where: { id: policy.id },
        data: { activeCount: { increment: 1 } },
      });
    }
  }

  const top = matches[0] || null;
  const claimDeadline = top
    ? new Date(Date.now() + top.coverageWindowDays * 24 * 60 * 60 * 1000)
    : null;

  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      hasBenefit: Boolean(top),
      detectedBenefit: top?.benefitTitle || null,
      benefitValue: top?.coverageLimit || 0,
      confidenceScore: top?.confidenceScore || 0,
      coverageLimit: top?.coverageLimit || 0,
      claimDeadline,
      reasoningChain: top
        ? safeStringify(
            matches.slice(0, 5).map((m) => ({
              label: m.benefitTitle,
              detail: m.reason,
              type: 'benefit',
            }))
          )
        : null,
    },
  });

  return created;
}

module.exports = { matchTransaction, matchAndPersist, evaluateRule };
