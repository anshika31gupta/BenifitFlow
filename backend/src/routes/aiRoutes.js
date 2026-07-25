const router = require('express').Router();
const { analyzeTransaction, chat } = require('../controllers/aiController');

// Kept public (no protect) to exactly match the existing frontend contract
// at /api/gemini/*, which the UI already calls without a JWT header.
router.post('/analyze-transaction', analyzeTransaction);
router.post('/chat', chat);

module.exports = router;
