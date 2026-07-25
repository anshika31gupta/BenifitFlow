const router = require('express').Router();
const { listCards, createCard } = require('../controllers/cardController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);
router.get('/', listCards);
router.post('/', createCard);

module.exports = router;
