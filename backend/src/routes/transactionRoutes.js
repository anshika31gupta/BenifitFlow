const router = require('express').Router();
const {
  listTransactions,
  getTransaction,
  createTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);
router.get('/', listTransactions);
router.get('/:id', getTransaction);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
