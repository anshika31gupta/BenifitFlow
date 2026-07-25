const prisma = require('../config/db');
const ApiError = require('../utils/ApiError');

async function listRules() {
  return prisma.ruleDefinition.findMany({ orderBy: { createdAt: 'asc' } });
}

async function createRule(data) {
  return prisma.ruleDefinition.create({
    data: {
      name: data.name,
      active: data.active ?? true,
      ifCategory: data.ifCategory,
      ifMinAmount: data.ifMinAmount,
      ifCard: data.ifCard,
      ifBank: data.ifBank || null,
      thenBenefitTitle: data.thenBenefitTitle,
      thenCoveragePct: data.thenCoveragePct ?? 100,
      coverageDays: data.coverageDays ?? 90,
      description: data.description || null,
    },
  });
}

async function updateRule(id, data) {
  const rule = await prisma.ruleDefinition.findUnique({ where: { id } });
  if (!rule) throw ApiError.notFound('Rule not found');
  return prisma.ruleDefinition.update({ where: { id }, data });
}

async function toggleRule(id) {
  const rule = await prisma.ruleDefinition.findUnique({ where: { id } });
  if (!rule) throw ApiError.notFound('Rule not found');
  return prisma.ruleDefinition.update({ where: { id }, data: { active: !rule.active } });
}

async function deleteRule(id) {
  const rule = await prisma.ruleDefinition.findUnique({ where: { id } });
  if (!rule) throw ApiError.notFound('Rule not found');
  await prisma.ruleDefinition.delete({ where: { id } });
  return { id };
}

module.exports = { listRules, createRule, updateRule, toggleRule, deleteRule };
