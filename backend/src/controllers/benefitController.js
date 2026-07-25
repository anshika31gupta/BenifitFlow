const asyncHandler = require('../utils/asyncHandler');
const benefitService = require('../services/benefitService');

const listPolicies = asyncHandler(async (req, res) => {
  const policies = await benefitService.listPolicies();
  res.json({ success: true, data: policies });
});

const checkBenefits = asyncHandler(async (req, res) => {
  const matches = await benefitService.checkBenefits(req.body);
  res.json({ success: true, data: matches });
});

module.exports = { listPolicies, checkBenefits };
