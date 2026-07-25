const { PrismaClient } = require('@prisma/client');

// Singleton Prisma client so we don't exhaust SQLite connections across
// hot reloads / multiple requires.
const prisma = global.__benefitflow_prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  global.__benefitflow_prisma = prisma;
}

module.exports = prisma;
