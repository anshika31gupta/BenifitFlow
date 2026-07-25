const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { matchAndPersist } = require('../../src/services/benefitMatcherService');
const { safeStringify } = require('../../src/utils/json');

const prisma = new PrismaClient();

const benefitPolicies = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../data/benefitPolicies.json'), 'utf-8')
);
const benefitRules = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../data/benefitRules.json'), 'utf-8')
);

const DEMO_USERS = [
  { name: 'Anshika Gupta', email: 'anshika@benefitflow.demo' },
  { name: 'Rahul Mehra', email: 'rahul@benefitflow.demo' },
  { name: 'Priya Nair', email: 'priya@benefitflow.demo' },
  { name: 'Karan Malhotra', email: 'karan@benefitflow.demo' },
  { name: 'Sara Fernandes', email: 'sara@benefitflow.demo' },
];
const DEMO_PASSWORD = 'Demo@1234';

const CARD_CATALOG = [
  { cardType: 'Visa Signature', bank: 'HDFC Bank', network: 'Visa' },
  { cardType: 'Amex Centurion', bank: 'American Express', network: 'Amex' },
  { cardType: 'Chase Sapphire Reserve', bank: 'Chase Bank', network: 'Mastercard' },
  { cardType: 'Mastercard World Elite', bank: 'ICICI Bank', network: 'Mastercard' },
  { cardType: 'HDFC Infinia', bank: 'HDFC Bank', network: 'Visa' },
];

const CATEGORIES = ['Electronics', 'Travel', 'Dining', 'Rideshare', 'Retail', 'Subscriptions'];
const MERCHANTS = {
  Electronics: ['Apple Store', 'Reliance Digital', 'Sony Center', 'Croma', 'Samsung Store'],
  Travel: ['Emirates Aviation', 'IndiGo Airlines', 'MakeMyTrip', 'Taj Hotels', 'Marriott Bonvoy'],
  Dining: ['Barbeque Nation', 'Starbucks', 'The Oberoi Dining', 'Domino\'s Pizza', 'Cafe Coffee Day'],
  Rideshare: ['Uber', 'Ola Cabs', 'Rapido', 'BluSmart'],
  Retail: ['Amazon India', 'Myntra', 'Zara', 'Decathlon', 'IKEA'],
  Subscriptions: ['Netflix', 'Spotify Premium', 'Amazon Prime', 'Disney+ Hotstar'],
};
const CITIES = ['Bengaluru', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Kanpur'];

function randomOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomAmount(category) {
  const ranges = {
    Electronics: [8000, 150000],
    Travel: [10000, 120000],
    Dining: [500, 6000],
    Rideshare: [150, 1200],
    Retail: [1000, 25000],
    Subscriptions: [199, 1999],
  };
  const [min, max] = ranges[category];
  return Math.round(min + Math.random() * (max - min));
}
function randomPastDate(maxDaysAgo) {
  const daysAgo = Math.floor(Math.random() * maxDaysAgo);
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

async function main() {
  console.log('Seeding BenefitFlow AI database...');

  // Clean slate (idempotent seed for demo purposes)
  await prisma.matchedBenefit.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.insight.deleteMany();
  await prisma.upload.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.card.deleteMany();
  await prisma.ruleDefinition.deleteMany();
  await prisma.benefitPolicy.deleteMany();
  await prisma.user.deleteMany();

  // --- Users ---
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const users = [];
  for (const u of DEMO_USERS) {
    const user = await prisma.user.create({ data: { ...u, passwordHash } });
    users.push(user);
  }
  console.log(`Created ${users.length} demo users (password for all: ${DEMO_PASSWORD})`);

  // --- Cards (each user gets 2-3 cards) ---
  const cardsByUser = {};
  for (const user of users) {
    const count = 2 + Math.floor(Math.random() * 2);
    const shuffled = [...CARD_CATALOG].sort(() => 0.5 - Math.random()).slice(0, count);
    cardsByUser[user.id] = [];
    for (const c of shuffled) {
      const card = await prisma.card.create({
        data: {
          userId: user.id,
          cardType: c.cardType,
          bank: c.bank,
          network: c.network,
          last4: String(1000 + Math.floor(Math.random() * 9000)),
        },
      });
      cardsByUser[user.id].push(card);
    }
  }
  console.log('Created cards for each user');

  // --- Benefit Policies ---
  for (const p of benefitPolicies) {
    await prisma.benefitPolicy.create({
      data: {
        title: p.title,
        category: p.category,
        description: p.description,
        maxCoverage: p.maxCoverage,
        coverageWindowDays: p.coverageWindowDays,
        eligibleCards: safeStringify(p.eligibleCards),
        requiredDocs: safeStringify(p.requiredDocs),
        iconName: p.iconName,
      },
    });
  }
  console.log(`Created ${benefitPolicies.length} benefit policies`);

  // --- Rules ---
  for (const r of benefitRules) {
    await prisma.ruleDefinition.create({ data: r });
  }
  console.log(`Created ${benefitRules.length} benefit rules`);

  // --- Transactions (30 across all users) ---
  const createdTxIds = [];
  for (let i = 0; i < 30; i++) {
    const user = randomOf(users);
    const card = randomOf(cardsByUser[user.id]);
    const category = randomOf(CATEGORIES);
    const merchant = randomOf(MERCHANTS[category]);

    const tx = await prisma.transaction.create({
      data: {
        userId: user.id,
        cardId: card.id,
        merchant,
        logo: category.toLowerCase(),
        amount: randomAmount(category),
        category,
        date: randomPastDate(180),
        cardUsed: card.cardType,
        cardLast4: card.last4,
        location: randomOf(CITIES),
        paymentMode: 'Card',
        source: 'seed',
      },
    });
    createdTxIds.push(tx.id);
  }
  console.log('Created 30 transactions');

  // --- Run the benefit matcher on every seeded transaction ---
  let matched = 0;
  for (const id of createdTxIds) {
    const results = await matchAndPersist(id);
    if (results.length) matched += 1;
  }
  console.log(`Benefit matcher ran on all transactions (${matched} had at least one match)`);

  // --- A couple of demo claims for the primary demo user ---
  const primaryUser = users[0];
  const primaryTxs = await prisma.transaction.findMany({
    where: { userId: primaryUser.id, hasBenefit: true },
    take: 2,
  });
  for (const tx of primaryTxs) {
    await prisma.claim.create({
      data: {
        claimNumber: `BF-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
        userId: primaryUser.id,
        transactionId: tx.id,
        merchant: tx.merchant,
        amount: tx.amount,
        benefitType: tx.detectedBenefit || 'Purchase Protection',
        cardUsed: tx.cardUsed,
        status: 'Under Review',
        currentStepIndex: 2,
        documentsAttached: safeStringify(['receipt.pdf']),
        payoutAmount: tx.benefitValue || 0,
        estimatedPayoutDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        auditLog: safeStringify([
          { timestamp: new Date().toISOString(), message: 'Claim auto-filed by BenefitFlow AI', actor: 'System AI' },
          { timestamp: new Date().toISOString(), message: 'Assigned to adjuster for review', actor: 'Adjuster' },
        ]),
      },
    });
    await prisma.transaction.update({ where: { id: tx.id }, data: { status: 'Under Review' } });
  }

  // --- A few proactive insights for the primary user ---
  await prisma.insight.createMany({
    data: [
      {
        userId: primaryUser.id,
        type: 'urgent',
        title: 'Claim deadline approaching',
        description: 'One of your electronics purchases has a benefit claim window closing soon.',
        timestamp: new Date(),
      },
      {
        userId: primaryUser.id,
        type: 'opportunity',
        title: 'Unclaimed purchase protection detected',
        description: 'BenefitFlow AI found eligible coverage you have not filed a claim for yet.',
        timestamp: new Date(),
      },
    ],
  });

  console.log('Seed complete. Demo login:');
  users.forEach((u) => console.log(`  ${u.email} / ${DEMO_PASSWORD}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
