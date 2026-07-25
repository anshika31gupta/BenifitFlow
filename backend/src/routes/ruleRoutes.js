const router = require('express').Router();
const {
  listRules,
  createRule,
  updateRule,
  toggleRule,
  deleteRule,
} = require('../controllers/ruleController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);
router.get('/', listRules);
router.post('/', createRule);
router.put('/:id', updateRule);
router.patch('/:id/toggle', toggleRule);
router.delete('/:id', deleteRule);

module.exports = router;
