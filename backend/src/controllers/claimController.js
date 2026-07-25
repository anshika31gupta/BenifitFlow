const asyncHandler = require('../utils/asyncHandler');
const claimService = require('../services/claimService');

const listClaims = asyncHandler(async (req, res) => {
  const claims = await claimService.listClaims(req.user.id);
  res.json({ success: true, data: claims });
});

const submitClaim = asyncHandler(async (req, res) => {
  const claim = await claimService.submitClaim(req.user.id, req.body);
  res.status(201).json({ success: true, data: claim });
});

const advanceClaim = asyncHandler(async (req, res) => {
  const claim = await claimService.advanceClaim(req.user.id, req.params.id, req.body);
  res.json({ success: true, data: claim });
});

module.exports = { listClaims, submitClaim, advanceClaim };
