const prisma = require('../config/db');

async function listInsights(userId) {
  return prisma.insight.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' },
    take: 20,
  });
}

module.exports = { listInsights };
