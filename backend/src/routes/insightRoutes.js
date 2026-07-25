const router = require('express').Router();
const { listInsights } = require('../controllers/insightController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, listInsights);

module.exports = router;
