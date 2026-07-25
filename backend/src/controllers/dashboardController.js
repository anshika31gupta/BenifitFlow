const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboardService');

const getDashboard = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await dashboardService.getDashboard(req.user.id) });
});

module.exports = { getDashboard };
