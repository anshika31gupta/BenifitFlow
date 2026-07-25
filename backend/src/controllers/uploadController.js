const asyncHandler = require('../utils/asyncHandler');
const uploadService = require('../services/uploadService');

const upload = asyncHandler(async (req, res) => {
  const result = await uploadService.processUpload(req.user.id, req.file);
  res.status(201).json({ success: true, data: result });
});

const listUploads = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await uploadService.listUploads(req.user.id) });
});

module.exports = { upload, listUploads };
