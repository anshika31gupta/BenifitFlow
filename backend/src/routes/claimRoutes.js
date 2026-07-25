const router = require('express').Router();
const { listClaims, submitClaim, advanceClaim } = require('../controllers/claimController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);
router.get('/', listClaims);
router.post('/', submitClaim);
router.patch('/:id', advanceClaim);

module.exports = router;
