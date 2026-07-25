const { parse } = require('csv-parse/sync');
const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');
const { createTransaction } = require('./transactionService');

/**
 * Parses an uploaded CSV/JSON buffer of transactions, persists each row as
 * a Transaction, runs the benefit matcher on every row, and records an
 * Upload audit entry. Expected columns/fields:
 *   merchant, amount, category, date, cardUsed, cardLast4, location, paymentMode
 */
async function processUpload(userId, file) {
  if (!file) throw ApiError.badRequest('No file uploaded');

  let rows;
  const isJson = file.originalname.toLowerCase().endsWith('.json') || file.mimetype === 'application/json';

  try {
    if (isJson) {
      const parsed = JSON.parse(file.buffer.toString('utf-8'));
      rows = Array.isArray(parsed) ? parsed : parsed.transactions || [];
    } else {
      rows = parse(file.buffer.toString('utf-8'), {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    }
  } catch (err) {
    throw ApiError.badRequest('Could not parse uploaded file. Ensure it is valid CSV or JSON.');
  }

  const created = [];
  let matchedCount = 0;

  for (const row of rows) {
    if (!row.merchant || !row.amount) continue;
    const tx = await createTransaction(
      userId,
      {
        merchant: row.merchant,
        amount: Number(row.amount),
        category: row.category || 'Retail',
        date: row.date,
        cardUsed: row.cardUsed,
        cardLast4: row.cardLast4,
        location: row.location,
        paymentMode: row.paymentMode,
      },
      'upload'
    );
    created.push(tx);
    if (tx.hasBenefit) matchedCount += 1;
  }

  const upload = await prisma.upload.create({
    data: {
      userId,
      filename: file.originalname,
      fileType: isJson ? 'json' : 'csv',
      status: 'processed',
      recordsFound: created.length,
      matchedCount,
    },
  });

  return { upload, transactions: created };
}

async function listUploads(userId) {
  return prisma.upload.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}

module.exports = { processUpload, listUploads };
