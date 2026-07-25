const asyncHandler = require('../utils/asyncHandler');
const ruleService = require('../services/ruleService');

const listRules = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await ruleService.listRules() });
});

const createRule = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await ruleService.createRule(req.body) });
});

const updateRule = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await ruleService.updateRule(req.params.id, req.body) });
});

const toggleRule = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await ruleService.toggleRule(req.params.id) });
});

const deleteRule = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await ruleService.deleteRule(req.params.id) });
});

module.exports = { listRules, createRule, updateRule, toggleRule, deleteRule };
