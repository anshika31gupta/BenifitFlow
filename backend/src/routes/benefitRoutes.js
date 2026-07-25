const router = require('express').Router();
const { listPolicies, checkBenefits } = require('../controllers/benefitController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, listPolicies);
router.post('/check', protect, checkBenefits);

module.exports = router;
