const router = require('express').Router();
const { signup, login, profile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validateBody } = require('../middlewares/validationMiddleware');

router.post(
  '/signup',
  validateBody({ name: { required: true, type: 'string' }, email: { required: true, type: 'string' }, password: { required: true, type: 'string' } }),
  signup
);
router.post(
  '/login',
  validateBody({ email: { required: true, type: 'string' }, password: { required: true, type: 'string' } }),
  login
);
router.get('/profile', protect, profile);

module.exports = router;
