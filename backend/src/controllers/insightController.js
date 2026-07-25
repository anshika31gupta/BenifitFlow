const asyncHandler = require('../utils/asyncHandler');
const insightService = require('../services/insightService');

const listInsights = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await insightService.listInsights(req.user.id) });
});

module.exports = { listInsights };
