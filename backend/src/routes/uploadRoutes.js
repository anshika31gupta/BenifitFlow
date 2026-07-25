const router = require('express').Router();
const multer = require('multer');
const { upload, listUploads } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');

const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.use(protect);
router.post('/', uploadMiddleware.single('file'), upload);
router.get('/', listUploads);

module.exports = router;
